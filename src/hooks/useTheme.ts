import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "lifeexe-theme";
const THEME_COLORS: Record<Theme, string> = { light: "#f3efe7", dark: "#10131a" };

function readSaved(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

/** The current theme. The first paint is handled by an inline script in index.html; this keeps it in sync. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next, true);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can block storage; the theme still applies for this visit.
    }
    setThemeState(next);
  }, []);

  // Follow the system setting until the person picks a theme themselves.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readSaved()) return;
      const next: Theme = query.matches ? "dark" : "light";
      applyTheme(next, true);
      setThemeState(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return { theme, setTheme };
}
