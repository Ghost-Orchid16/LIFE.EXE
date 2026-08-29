"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--fg-muted)] sm:flex-row">
        <p>
          LIFE<span className="text-gradient">.EXE</span> — Life didn&apos;t come with a manual. Figure it out.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/workspace" className="hover:text-[var(--fg)]">
            Workspace
          </Link>
          <Link href="/test-lab" className="hover:text-[var(--fg)]">
            Test Lab
          </Link>
          <span>Prototype — not a substitute for professional advice.</span>
        </div>
      </div>
    </footer>
  );
}
