export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDuration(startDate: Date, endDate: Date): { weeks: number; months: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get the Monday of the start week and the Monday of the end week
  const startWeekMonday = getWeekStart(start);
  const endWeekMonday = getWeekStart(end);

  // Calculate full weeks between the two Mondays, +1 to include both weeks
  const diffMs = endWeekMonday.getTime() - startWeekMonday.getTime();
  const weeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;

  const months = Math.round((weeks / 52) * 12 * 10) / 10;
  return { weeks, months };
}
