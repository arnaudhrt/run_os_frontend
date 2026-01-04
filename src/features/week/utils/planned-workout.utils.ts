import type { ActivityType, WorkoutType } from "@/lib/types/type";

export const activityTypeLabels: Record<ActivityType, string> = {
  run: "Run",
  trail: "Trail Run",
  treadmill: "Treadmill",
  hike: "Hike",
  bike: "Bike",
  swim: "Swim",
  strength: "Strength",
  cross_training: "Cross Training",
  rest_day: "Rest Day",
};

export const workoutTypeLabels: Record<WorkoutType, string> = {
  easy_run: "Easy Run",
  hills: "Hills",
  long_run: "Long Run",
  tempo: "Tempo",
  threshold: "Threshold",
  intervals: "Intervals",
  race: "Race",
  base_endurance: "Base Endurance",
  uncategorized: "Uncategorized",
  other: "Other",
};

export const timeSlotOptions = [
  { value: "single", label: "Single Session", description: "One workout for the day" },
  { value: "am", label: "Morning (AM)", description: "First session of the day" },
  { value: "pm", label: "Afternoon/Evening (PM)", description: "Second session of the day" },
] as const;

export function formatActivityType(type: ActivityType): string {
  return activityTypeLabels[type] || type;
}

export function formatWorkoutType(type: WorkoutType): string {
  return workoutTypeLabels[type] || type;
}

export function parseDurationToSeconds(duration: string): number | null {
  if (!duration) return null;

  // Handle HH:MM:SS format
  const parts = duration.split(":").map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  if (parts.length === 1) {
    return parts[0] * 60; // Assume minutes
  }

  return null;
}

export function formatSecondsToHHMMSS(seconds?: number | null): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

interface WeekDay {
  date: string; // YYYY-MM-DD format
  dayShort: string; // Mon, Tue, etc.
  dayNum: number; // Day of month
}

/**
 * Get all 7 days of the week starting from the given week start date (Monday)
 */
export function getWeekDays(weekStartDate: Date): WeekDay[] {
  const days: WeekDay[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    days.push({
      date: `${year}-${month}-${day}`,
      dayShort: dayNames[i],
      dayNum: date.getDate(),
    });
  }

  return days;
}

export function getCompletionPercent(planned: number, actual: number): number {
  if (planned === 0) return 0;
  return Math.round((actual / planned) * 100);
}

/**
 * Get the start and end dates of a week based on an offset from the current week
 * @param offset - Number of weeks from current week (0 = current, -1 = last, 1 = next)
 * @returns Object with start (Monday) and end (Sunday) dates
 */
export function getWeekDateRange(offset: number): { start: Date; end: Date; startStr: string; endStr: string } {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset + offset * 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    start: weekStart,
    end: weekEnd,
    startStr: formatDate(weekStart),
    endStr: formatDate(weekEnd),
  };
}
