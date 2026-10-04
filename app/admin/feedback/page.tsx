import type { Metadata } from "next";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { FeedbackQueue } from "@/components/admin/FeedbackQueue";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { Label } from "@/components/ui/Label";
import { adminConfigurationProblem, hasAdminSession, isAdminConfigured } from "@/lib/admin/session";
import { listAllFeedback } from "@/lib/feedback/store";

/**
 * Feedback moderation.
 *
 * Never cached and never indexed: it reads the session cookie on every request,
 * and it shows client email addresses. `robots.ts` also disallows /admin, and
 * the metadata below sets noindex as a second line of defence.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback Queue",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminFeedbackPage() {
  const configured = isAdminConfigured();
  const signedIn = configured && (await hasAdminSession());

  if (!configured) {
    return (
      <div data-tone="light" className="bg-surface py-32">
        <div className="shell">
          <div className="mx-auto max-w-xl rounded-panel border border-line/12 bg-raised p-8 sm:p-10">
            <Label rule>Not configured</Label>
            <h1 className="mt-6 text-title font-semibold text-navy">
              The queue is switched off.
            </h1>
            <p className="mt-4 text-body text-fg/85">{adminConfigurationProblem()}</p>
            <p className="mt-4 text-meta text-fg/80">
              Set <code className="text-accent">ADMIN_PASSWORD</code> in the server environment
              (at least 12 characters) and restart. Submitted reviews are safe in the meantime —
              they are stored and waiting, just not reviewable here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div data-tone="light" className="bg-surface py-32">
        <div className="shell">
          <AdminLogin />
        </div>
      </div>
    );
  }

  const entries = await listAllFeedback();
  const pending = entries.filter((entry) => entry.status === "pending").length;

  return (
    <div data-tone="light" className="bg-surface py-28 sm:py-32">
      <div className="shell">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/12 pb-8">
          <div>
            <Label rule>Moderation</Label>
            <h1 className="mt-5 text-headline font-bold text-navy">Feedback queue</h1>
            <p className="mt-4 max-w-[52ch] text-body text-fg/85">
              {pending > 0
                ? `${pending} ${pending === 1 ? "review is" : "reviews are"} waiting for you. Publishing one puts it on the homepage and the reviews page straight away.`
                : "Nothing is waiting. Published reviews appear on the homepage and the reviews page."}
            </p>
          </div>
          <AdminSignOut />
        </header>

        <div className="mt-10">
          <FeedbackQueue entries={entries} />
        </div>
      </div>
    </div>
  );
}
