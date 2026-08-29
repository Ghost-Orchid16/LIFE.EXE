import type { ThemeId } from "@/lib/types";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
}

// Preview swatch colors for the theme switcher — kept in sync by hand with
// the real CSS custom properties in app/globals.css. Needed because a
// dropdown row previewing a theme that ISN'T currently active can't read
// that theme's CSS variables (only the active data-theme's vars are live),
// so each option needs its own literal color reference here.
export const THEME_PREVIEW: Record<ThemeId, { bg: string; accent: string; accent2: string }> = {
  cosmos: { bg: "#05060d", accent: "#8ea2ff", accent2: "#c9a3ff" },
  futuristic: { bg: "#050807", accent: "#39ffb0", accent2: "#33d1ff" },
  ambient: { bg: "#0b0c14", accent: "#ffb4a8", accent2: "#b7a6ff" },
  mono: { bg: "#08090a", accent: "#ffffff", accent2: "#8a8a8a" },
  organic: { bg: "#0f0d09", accent: "#e8b06b", accent2: "#9fc088" },
  glass: { bg: "#0a0d16", accent: "#8fd7ff", accent2: "#a0a8ff" },
  ocean: { bg: "#030c14", accent: "#4fd8e8", accent2: "#3f8fd6" },
  sunset: { bg: "#160a0e", accent: "#ff9a5a", accent2: "#ff6b9d" },
};

export const THEMES: ThemeMeta[] = [
  { id: "cosmos", name: "Cosmos", icon: "\u{1F30C}", description: "Deep-space calm. Stars, nebula drift, elegant type." },
  { id: "futuristic", name: "Futuristic", icon: "⚡", description: "Cyber grid, glowing edges, holographic panels." },
  { id: "ambient", name: "Ambient", icon: "\u{1F32B}️", description: "Soft atmospheric gradients, minimal and calm." },
  { id: "mono", name: "Mono", icon: "\u{1F5A4}", description: "Ultra-minimal black & white, typography-first." },
  { id: "organic", name: "Organic", icon: "\u{1F33F}", description: "Warm, natural tones and gentle movement." },
  { id: "glass", name: "Glass", icon: "\u{1F9CA}", description: "Layered translucent glassmorphism." },
  { id: "ocean", name: "Ocean", icon: "\u{1F30A}", description: "Underwater depth, drifting light, slow currents." },
  { id: "sunset", name: "Sunset", icon: "\u{1F307}", description: "Warm dusk horizon, glowing amber light." },
];

export const DEFAULT_THEME: ThemeId = "cosmos";
