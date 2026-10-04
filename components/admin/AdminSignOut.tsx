"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Clears the moderation session cookie. */
export function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    if (busy) return;
    setBusy(true);

    try {
      await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="rounded-full border border-line/20 px-4 py-2 text-[0.8125rem] font-medium text-fg/85 transition-colors duration-300 hover:border-blue/45 disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
