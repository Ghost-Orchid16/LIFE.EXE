"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryEntry, ThemeId } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/themes";

interface LifeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;

  hasOnboarded: boolean;
  completeOnboarding: () => void;

  noSugarcoating: boolean;
  toggleNoSugarcoating: () => void;

  history: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, "id" | "createdAt">) => void;
  clearHistory: () => void;

  situationsExplored: number;
  conversationsPracticed: number;
  decisionsSimulated: number;
  bumpCounter: (key: "situationsExplored" | "conversationsPracticed" | "decisionsSimulated") => void;
}

export const useLifeStore = create<LifeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),

      hasOnboarded: false,
      completeOnboarding: () => set({ hasOnboarded: true }),

      noSugarcoating: false,
      toggleNoSugarcoating: () => set((s) => ({ noSugarcoating: !s.noSugarcoating })),

      history: [],
      addHistoryEntry: (entry) =>
        set((s) => ({
          history: [
            { ...entry, id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() },
            ...s.history,
          ].slice(0, 50),
        })),
      clearHistory: () => set({ history: [], situationsExplored: 0, conversationsPracticed: 0, decisionsSimulated: 0 }),

      situationsExplored: 0,
      conversationsPracticed: 0,
      decisionsSimulated: 0,
      bumpCounter: (key) => set((s) => ({ [key]: s[key] + 1 }) as Partial<LifeState>),
    }),
    {
      name: "life-exe-store",
      partialize: (s) => ({
        theme: s.theme,
        hasOnboarded: s.hasOnboarded,
        noSugarcoating: s.noSugarcoating,
        history: s.history,
        situationsExplored: s.situationsExplored,
        conversationsPracticed: s.conversationsPracticed,
        decisionsSimulated: s.decisionsSimulated,
      }),
    }
  )
);
