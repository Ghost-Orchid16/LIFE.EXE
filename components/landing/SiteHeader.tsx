"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-lg" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          LIFE<span className="text-gradient">.EXE</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[var(--fg-muted)] md:flex">
          <Link href="/workspace" className="transition hover:text-[var(--fg)]">
            Workspace
          </Link>
          <Link href="/history" className="transition hover:text-[var(--fg)]">
            History
          </Link>
          <Link href="/test-lab" className="transition hover:text-[var(--fg)]">
            Test Lab
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link
            href="/workspace"
            className="hidden rounded-full bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition hover:opacity-90 sm:inline-flex"
          >
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
