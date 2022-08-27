export function parsePageSafe(value: string | number | undefined): number {
  if (value === "") return 1;
  if (value === undefined) return NaN;
  const str = typeof value === "string" ? value : `${value}`;
  return parseInt(str, 10);
}
