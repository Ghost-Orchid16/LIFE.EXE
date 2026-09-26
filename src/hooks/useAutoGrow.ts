import { useLayoutEffect, type RefObject } from "react";

/** Grows a textarea with its content, up to `maxHeight` pixels, then lets it scroll. */
export function useAutoGrow(ref: RefObject<HTMLTextAreaElement | null>, value: string, maxHeight: number) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    const height = Math.min(element.scrollHeight, maxHeight);
    element.style.height = `${height}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, maxHeight]);
}
