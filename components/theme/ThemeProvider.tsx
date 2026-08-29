"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useLifeStore } from "@/lib/store/useLifeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useLifeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
