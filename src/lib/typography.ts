/** Turns straight quotes and apostrophes into typographic ones for display. */
export function smarten(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([{—-])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([{—-])"/g, "$1“")
    .replace(/"/g, "”");
}

export const formatCount = (value: number) => value.toLocaleString("en-US");

const DAY_MS = 86_400_000;
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** When something last happened, the way a person would say it: "5 minutes ago", "yesterday", "Mar 3". */
export function formatWhen(time: number, now = Date.now()): string {
  const minutes = Math.floor((now - time) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return relative.format(-minutes, "minute");
  const then = new Date(time);
  const today = new Date(now);
  const days = Math.round(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime()) /
      DAY_MS,
  );
  if (days < 1) return relative.format(-Math.floor(minutes / 60), "hour");
  if (days < 7) return relative.format(-days, "day");
  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(then.getFullYear() !== today.getFullYear() && { year: "numeric" }),
  });
}
