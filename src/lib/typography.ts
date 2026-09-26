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
