export type SightingStatus = "known" | "uncertain" | "unknown";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysSince(lastActivity: Date, now: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(now).getTime() - startOfDay(lastActivity).getTime()) / msPerDay);
}

export function statusForDaysAgo(daysAgo: number): SightingStatus {
  if (daysAgo <= 0) return "known";
  if (daysAgo <= 3) return "uncertain";
  return "unknown";
}

export function uncertainLabel(daysAgo: number): string {
  if (daysAgo === 1) return "gestern bestätigt";
  if (daysAgo === 2) return "vorgestern bestätigt";
  return `vor ${daysAgo} Tagen bestätigt`;
}
