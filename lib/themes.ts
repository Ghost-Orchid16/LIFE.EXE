import type { ThemeId } from "@/lib/types";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "cosmos", name: "Cosmos", icon: "\u{1F30C}", description: "Deep-space calm. Stars, nebula drift, elegant type." },
  { id: "futuristic", name: "Futuristic", icon: "⚡", description: "Cyber grid, glowing edges, holographic panels." },
  { id: "ambient", name: "Ambient", icon: "\u{1F32B}️", description: "Soft atmospheric gradients, minimal and calm." },
  { id: "mono", name: "Mono", icon: "\u{1F5A4}", description: "Ultra-minimal black & white, typography-first." },
  { id: "organic", name: "Organic", icon: "\u{1F33F}", description: "Warm, natural tones and gentle movement." },
  { id: "glass", name: "Glass", icon: "\u{1F9CA}", description: "Layered translucent glassmorphism." },
];

export const DEFAULT_THEME: ThemeId = "cosmos";
