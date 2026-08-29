"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const LifeCoreScene = dynamic(() => import("./LifeCoreScene"), { ssr: false });

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function noSubscription() {
  return () => {};
}

function usePerformanceGate() {
  return useSyncExternalStore(
    noSubscription,
    () => {
      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const smallViewport = window.innerWidth < 480;
      return cores >= 4 && memory >= 4 && !smallViewport;
    },
    () => true
  );
}

function useIsClient() {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
}

export default function LifeCore() {
  const isClient = useIsClient();
  const reduced = useReducedMotion();
  const perfOk = usePerformanceGate();

  if (!isClient) return <div className="h-full w-full" aria-hidden="true" />;

  if (reduced || !perfOk) {
    return (
      <div
        aria-hidden="true"
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb),0.55), rgba(var(--accent-2-rgb),0.2) 45%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
    );
  }

  return (
    <div className="h-full w-full" aria-hidden="true">
      <LifeCoreScene />
    </div>
  );
}
