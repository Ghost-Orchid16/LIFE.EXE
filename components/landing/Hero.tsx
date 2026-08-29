"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import LifeCore from "@/components/three/LifeCore";
import SituationInput from "@/components/workspace/SituationInput";

const FRAGMENTS: { word: string; x: number; y: number; rotate: number }[] = [
  { word: "DECIDE", x: -320, y: -180, rotate: -8 },
  { word: "CONNECT", x: 300, y: -220, rotate: 6 },
  { word: "CHANGE", x: -380, y: 60, rotate: 4 },
  { word: "TRY", x: 340, y: 20, rotate: -5 },
  { word: "FAIL", x: -260, y: 220, rotate: 7 },
  { word: "GROW", x: 280, y: 240, rotate: -6 },
  { word: "MOVE", x: -120, y: -280, rotate: 3 },
  { word: "BEGIN", x: 140, y: 280, rotate: -3 },
];

function FragmentWord({
  word,
  x,
  y,
  rotate,
  converge,
  opacity,
  delay,
}: {
  word: string;
  x: number;
  y: number;
  rotate: number;
  converge: MotionValue<number>;
  opacity: MotionValue<number>;
  delay: number;
}) {
  const fx = useTransform(converge, [1, 0], [x, 0]);
  const fy = useTransform(converge, [1, 0], [y, 0]);
  const frotate = useTransform(converge, [1, 0], [rotate, 0]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, x: fx, y: fy, rotate: frotate }}
      className="pointer-events-none absolute hidden font-[family-name:var(--font-display)] text-lg font-semibold tracking-widest text-[var(--fg-muted)] sm:block sm:text-2xl"
      transition={{ delay }}
    >
      {word}
    </motion.span>
  );
}

// Manual scroll-progress tracking instead of framer-motion's useScroll({target}),
// which produced non-monotonic progress values (a rise-then-fall artifact) with
// this sticky-pinned layout. Computing progress directly from window.scrollY on
// a native scroll listener is simpler and reliably monotonic.
function useHeroProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    function update() {
      const el = ref.current;
      if (el) {
        const range = el.offsetHeight - window.innerHeight;
        const p = range > 0 ? (window.scrollY - el.offsetTop) / range : 0;
        progress.set(Math.min(1, Math.max(0, p)));
      }
      raf = 0;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return progress;
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useHeroProgress(ref);

  const converge = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const fragmentOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 0.6, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.35, 0.6], [0.85, 1]);
  const taglineOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const inputOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const inputY = useTransform(scrollYProgress, [0.72, 0.9], [24, 0]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [1, 0.9, 0.35, 0.15]);
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <div ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <motion.div
          style={{ opacity: coreOpacity, scale: coreScale }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[70vmin] w-[70vmin] max-h-[640px] max-w-[640px]">
            <LifeCore />
          </div>
        </motion.div>

        {FRAGMENTS.map((f, i) => (
          <FragmentWord
            key={f.word}
            word={f.word}
            x={f.x}
            y={f.y}
            rotate={f.rotate}
            converge={converge}
            opacity={fragmentOpacity}
            delay={i * 0.02}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h1
            style={{ opacity: logoOpacity, scale: logoScale }}
            className="text-6xl font-bold tracking-tight text-[var(--fg)] sm:text-8xl font-[family-name:var(--font-display)]"
          >
            LIFE<span className="text-gradient">.EXE</span>
          </motion.h1>
          <motion.p
            style={{ opacity: taglineOpacity }}
            className="mt-6 max-w-xl text-balance text-lg text-[var(--fg-muted)] sm:text-xl"
          >
            Life didn&apos;t come with a manual.
          </motion.p>

          <motion.div style={{ opacity: inputOpacity, y: inputY }} className="mt-10 w-[min(90vw,640px)]">
            <SituationInput />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--fg-muted)]"
        >
          <span>Scroll</span>
          <span className="h-8 w-px animate-pulse bg-[var(--fg-muted)]" />
        </motion.div>
      </div>
    </div>
  );
}
