"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

export function Section({
  id,
  className,
  children,
  kicker,
  title,
  subtitle,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
  kicker?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section id={id} className={clsx("relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-32", className)}>
      {(kicker || title || subtitle) && (
        <SectionHeading kicker={kicker} title={title} subtitle={subtitle} />
      )}
      {children}
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("mb-14 max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {kicker && (
        <span className="mb-4 inline-block rounded-full border border-[var(--border)] px-3 py-1 font-mono text-xs tracking-[0.2em] text-[var(--fg-muted)] uppercase">
          {kicker}
        </span>
      )}
      {title && (
        <h2 className="text-balance font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {title}
        </h2>
      )}
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-[var(--fg-muted)]">{subtitle}</p>}
    </motion.div>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
