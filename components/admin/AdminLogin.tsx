"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

/** Password gate for the moderation queue. One operator, one password. */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && result.ok) {
        setPassword("");
        // The page is a server component, so it re-reads the session on refresh.
        router.refresh();
        return;
      }

      setError(result.message ?? "That password was not accepted.");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-panel border border-line/12 bg-raised p-8 sm:p-10"
    >
      <Label rule>Moderation</Label>
      <h1 className="mt-6 text-title font-semibold text-navy">Sign in</h1>
      <p className="mt-3 text-meta text-fg/80">
        The feedback queue is private. Enter the admin password to continue.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-accent text-label uppercase tracking-[0.16em] text-navy/80"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "password-error" : undefined}
          className="w-full rounded-full border border-navy/15 bg-white px-5 py-3.5 text-[0.9375rem] text-navy transition-colors duration-300 focus:outline-none focus-visible:border-blue"
        />
        {error ? (
          <p id="password-error" role="alert" className="text-[0.8125rem] font-medium text-blue-solid">
            {error}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <Button type="submit" variant="primary" disabled={busy || password.length === 0}>
          {busy ? "Checking…" : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
