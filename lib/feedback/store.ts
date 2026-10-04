import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FeedbackInput } from "@/lib/feedback/schema";

/**
 * Persistence for client feedback.
 *
 * Deliberately a single JSON file rather than a database. The site runs under
 * `next start` on a Node host with a persistent disk, the expected volume is a
 * few dozen reviews a year, and a file keeps the deployment to one moving part.
 *
 * ── If this ever moves to a serverless host (Vercel, Netlify functions) ──────
 * The filesystem there is read-only and per-invocation, so writes would be
 * silently lost. Everything outside this file talks only to the exported
 * functions below, so swapping in Postgres/Supabase/Turso means reimplementing
 * `readAll` / `writeAll` against that driver and changing nothing else.
 *
 * Writes are atomic (temp file + rename) and serialised through an in-process
 * queue, so a half-written file can never be read and two concurrent
 * submissions cannot clobber each other.
 */

export type FeedbackStatus = "pending" | "approved" | "rejected";

export type FeedbackRecord = {
  id: string;
  /** ISO 8601, UTC. */
  submittedAt: string;
  /** ISO 8601, set the first time the entry is approved or rejected. */
  reviewedAt?: string;
  status: FeedbackStatus;
  /** Promotes the entry to the large pull-quote slot on the reviews page. */
  featured?: boolean;

  name: string;
  /** Private. Striped by `toPublic` and never sent to the browser. */
  email: string;
  role?: string;
  company?: string;
  website?: string;
  projectType?: string;
  rating: number;
  headline?: string;
  quote: string;
  consentToPublish: boolean;
  source: "website";
};

/** The shape the public pages receive — no email, no moderation metadata. */
export type PublicFeedback = {
  id: string;
  submittedAt: string;
  name: string;
  role?: string;
  company?: string;
  website?: string;
  projectType?: string;
  rating: number;
  headline?: string;
  quote: string;
  featured?: boolean;
};

type StoreFile = {
  version: 1;
  entries: FeedbackRecord[];
};

const EMPTY: StoreFile = { version: 1, entries: [] };

/**
 * Where the file lives. Defaults to `.data/` beside the project, which is
 * gitignored and survives restarts on a Node host. Point FEEDBACK_DATA_DIR at
 * a volume outside the deploy directory if releases replace the whole tree.
 */
const DATA_DIR = process.env.FEEDBACK_DATA_DIR
  ? path.resolve(process.env.FEEDBACK_DATA_DIR)
  : path.join(process.cwd(), ".data");

const DATA_FILE = path.join(DATA_DIR, "feedback.json");

async function readAll(): Promise<StoreFile> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as StoreFile).entries)
    ) {
      return { version: 1, entries: (parsed as StoreFile).entries };
    }

    console.warn("[feedback] Store file has an unexpected shape; treating it as empty.");
    return EMPTY;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // A missing file is the normal first-run state, not a problem.
    if (code === "ENOENT") return EMPTY;

    console.error(
      "[feedback] Could not read the store:",
      error instanceof Error ? error.message : "unknown error",
    );
    throw error;
  }
}

async function writeAll(data: StoreFile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  // Temp file in the same directory, then rename: rename is atomic within a
  // filesystem, so a reader sees either the old file or the new one, never a
  // partial write.
  const temp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, DATA_FILE);
}

/**
 * Serialises every mutation. Reads go straight to disk; only read-modify-write
 * cycles need the queue, and they all run through `mutate`.
 */
let queue: Promise<unknown> = Promise.resolve();

function mutate<T>(operation: (data: StoreFile) => { data: StoreFile; result: T }): Promise<T> {
  const next = queue.then(async () => {
    const current = await readAll();
    const { data, result } = operation(current);
    await writeAll(data);
    return result;
  });

  // Keep the chain alive even if one operation rejects, so a single failure
  // does not wedge every later write.
  queue = next.catch(() => undefined);
  return next;
}

function trimmed(value: string | undefined): string | undefined {
  const next = value?.trim();
  return next ? next : undefined;
}

export function toPublic(entry: FeedbackRecord): PublicFeedback {
  return {
    id: entry.id,
    submittedAt: entry.submittedAt,
    name: entry.name,
    role: entry.role,
    company: entry.company,
    website: entry.website,
    projectType: entry.projectType,
    rating: entry.rating,
    headline: entry.headline,
    quote: entry.quote,
    featured: entry.featured,
  };
}

type NewFeedback = Omit<FeedbackInput, "honeypot" | "elapsedMs">;

/** Stores a submission as `pending`. Returns the record that was written. */
export async function addFeedback(input: NewFeedback): Promise<FeedbackRecord> {
  const record: FeedbackRecord = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "pending",
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: trimmed(input.role),
    company: trimmed(input.company),
    website: trimmed(input.website),
    projectType: trimmed(input.projectType),
    rating: input.rating,
    headline: trimmed(input.headline),
    quote: input.quote.trim(),
    consentToPublish: input.consentToPublish,
    source: "website",
  };

  return mutate((data) => ({
    // Newest first, so the moderation queue needs no sorting.
    data: { ...data, entries: [record, ...data.entries] },
    result: record,
  }));
}

/** Every entry, newest first. Admin surfaces only. */
export async function listAllFeedback(): Promise<FeedbackRecord[]> {
  const { entries } = await readAll();
  return [...entries].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/**
 * The approved, publishable entries — the only ones any public page may show.
 * Consent is re-checked here rather than trusted from the approval step, so an
 * entry can never reach the site without it.
 */
export async function listPublishedFeedback(): Promise<PublicFeedback[]> {
  const { entries } = await readAll();

  return entries
    .filter((entry) => entry.status === "approved" && entry.consentToPublish)
    .sort((a, b) => {
      if (Boolean(b.featured) !== Boolean(a.featured)) return b.featured ? 1 : -1;
      return b.submittedAt.localeCompare(a.submittedAt);
    })
    .map(toPublic);
}

/** Counts for the admin badge. */
export async function feedbackCounts(): Promise<Record<FeedbackStatus, number>> {
  const { entries } = await readAll();
  const counts: Record<FeedbackStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const entry of entries) counts[entry.status] += 1;
  return counts;
}

export type ModerationResult =
  | { ok: true; entry?: FeedbackRecord }
  | { ok: false; reason: "not_found" | "no_consent" };

/** Approves an entry. Refuses if the client did not consent to publication. */
export async function approveFeedback(id: string): Promise<ModerationResult> {
  return mutate((data) => {
    const entry = data.entries.find((item) => item.id === id);
    if (!entry) return { data, result: { ok: false, reason: "not_found" } as ModerationResult };

    if (!entry.consentToPublish) {
      return { data, result: { ok: false, reason: "no_consent" } as ModerationResult };
    }

    const updated: FeedbackRecord = {
      ...entry,
      status: "approved",
      reviewedAt: new Date().toISOString(),
    };

    return {
      data: { ...data, entries: data.entries.map((item) => (item.id === id ? updated : item)) },
      result: { ok: true, entry: updated } as ModerationResult,
    };
  });
}

/** Hides an entry from the site. The text is kept so the decision is reversible. */
export async function rejectFeedback(id: string): Promise<ModerationResult> {
  return mutate((data) => {
    const entry = data.entries.find((item) => item.id === id);
    if (!entry) return { data, result: { ok: false, reason: "not_found" } as ModerationResult };

    const updated: FeedbackRecord = {
      ...entry,
      status: "rejected",
      featured: false,
      reviewedAt: new Date().toISOString(),
    };

    return {
      data: { ...data, entries: data.entries.map((item) => (item.id === id ? updated : item)) },
      result: { ok: true, entry: updated } as ModerationResult,
    };
  });
}

/** Only one entry is ever featured, so setting a new one clears the old. */
export async function setFeatured(id: string, featured: boolean): Promise<ModerationResult> {
  return mutate((data) => {
    const entry = data.entries.find((item) => item.id === id);
    if (!entry) return { data, result: { ok: false, reason: "not_found" } as ModerationResult };

    const entries = data.entries.map((item) => {
      if (item.id === id) return { ...item, featured };
      return featured ? { ...item, featured: false } : item;
    });

    return {
      data: { ...data, entries },
      result: { ok: true, entry: { ...entry, featured } } as ModerationResult,
    };
  });
}

/** Permanent removal, for spam. */
export async function deleteFeedback(id: string): Promise<ModerationResult> {
  return mutate((data) => {
    const exists = data.entries.some((item) => item.id === id);
    if (!exists) return { data, result: { ok: false, reason: "not_found" } as ModerationResult };

    return {
      data: { ...data, entries: data.entries.filter((item) => item.id !== id) },
      result: { ok: true } as ModerationResult,
    };
  });
}

/** Average and count across published entries, for the rating summary. */
export function ratingSummary(entries: PublicFeedback[]): { average: number; count: number } | null {
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
  return {
    average: Math.round((total / entries.length) * 10) / 10,
    count: entries.length,
  };
}
