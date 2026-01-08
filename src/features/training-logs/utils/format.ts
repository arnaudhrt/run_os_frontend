import type { ActivityModel, DayEntry, WeekEntry, MonthEntry, YearEntry, StructuredActivitiesLog } from "../models/activity.model";

export function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function formatPace(paceMinPerKm: number | undefined): string {
  if (!paceMinPerKm) return "-";
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

export function formatElevation(meters: number | undefined): string {
  if (!meters) return "-";
  return `${meters} m`;
}

export function formatHeartRate(bpm: number | undefined): string {
  if (!bpm) return "-";
  return `${bpm} bpm`;
}

export function formatAvgMaxHR(avg: number | undefined, max: number | undefined): string {
  if (!avg) return "-";
  if (!max) return `${avg} bpm`;
  return `${avg}/${max} bpm`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatWorkoutType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatActivityType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function speedToPace(speedMs: number): number | null {
  if (speedMs <= 0) return null;

  // 1 km = 1000 meters
  // pace (min/km) = 1000 / speed (m/s) / 60 (to convert seconds to minutes)
  const paceMinPerKm = 1000 / speedMs / 60;

  return Number(paceMinPerKm.toFixed(2));
}

export function renderPace(distanceMeters: number | undefined, durationSeconds: number | undefined): string {
  if (!distanceMeters || !durationSeconds) {
    return "-";
  }
  if (distanceMeters <= 0 || durationSeconds <= 0) {
    return "-";
  }

  // seconds per kilometer
  const paceSecondsPerKm = durationSeconds / (distanceMeters / 1000);

  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.round(paceSecondsPerKm % 60);

  // handle rounding edge case (e.g. 4:59.9 → 5:00)
  const paddedSeconds = seconds === 60 ? 0 : seconds;
  const adjustedMinutes = seconds === 60 ? minutes + 1 : minutes;

  return `${adjustedMinutes}:${paddedSeconds.toString().padStart(2, "0")} min/km`;
}

export function formatRpe(rpe: number | undefined): string {
  if (!rpe) return "-";
  switch (rpe) {
    case 1:
      return "😌 Very easy";
    case 2:
      return "🙂 Easy";
    case 3:
      return "😐 Moderate";
    case 4:
      return "😖 Hard";
    case 5:
      return "🥵 Max effort";
    default:
      return "-";
  }
}

export function completeWeekDays(week: WeekEntry): (DayEntry & { isOutsideMonth: boolean })[] {
  const existingDays = week.days || [];

  // If already 7 days, just add the flag as false
  if (existingDays.length === 7) {
    return existingDays.map((d) => ({ ...d, isOutsideMonth: false }));
  }

  const completeDays: (DayEntry & { isOutsideMonth: boolean })[] = [];
  const startDate = new Date(week.startDate);

  // Generate all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];

    const existingDay = existingDays.find((d) => d.date === dateStr);

    if (existingDay) {
      completeDays.push({ ...existingDay, isOutsideMonth: false });
    } else {
      completeDays.push({
        date: dateStr,
        dayOfWeek: currentDate.getDay(),
        isRestDay: false,
        activities: null,
        isOutsideMonth: true,
      });
    }
  }

  // Sort descending (Sunday first, Monday last)
  return completeDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ============ DATE HELPERS ============

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// ============ TOTALS HELPERS ============

type BaseTotals = WeekEntry["totals"];
type YearTotals = YearEntry["totals"];

const createBaseTotals = (): BaseTotals => ({
  distance_meters: 0,
  duration_seconds: 0,
  elevation_gain_meters: 0,
  activities_count: 0,
});

const createYearTotals = (): YearTotals => ({
  ...createBaseTotals(),
  races_count: 0,
});

// ============ MAIN FUNCTION ============

export function structureActivitiesLog(activities: ActivityModel[], minDateStr: string | null, maxDateStr: string | null): StructuredActivitiesLog {
  const emptyResult: StructuredActivitiesLog = { years: [], totals: createYearTotals() };

  if (!minDateStr || !maxDateStr || activities.length === 0) {
    return emptyResult;
  }

  // 1. Index activities by LOCAL date
  const activitiesByDate = new Map<string, ActivityModel[]>();
  for (const act of activities) {
    const localDateStr = toLocalDateString(new Date(act.start_time));
    const group = activitiesByDate.get(localDateStr) || [];
    group.push(act);
    activitiesByDate.set(localDateStr, group);
  }

  // 2. Expand date range to FULL MONTHS
  const minDate = new Date(minDateStr);
  const maxDate = new Date(maxDateStr);

  // Start: 1st of minDate's month
  const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  // End: last day of maxDate's month
  const lastDayOfMaxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const endDate = lastDayOfMaxMonth < today ? lastDayOfMaxMonth : today;

  // 3. Build nested structure
  const globalTotals = createYearTotals();
  const yearsMap = new Map<
    number,
    {
      year: number;
      months: Map<
        number,
        {
          month: number;
          monthName: string;
          weeks: Map<
            string,
            {
              weekNumber: number;
              startDate: string;
              endDate: string;
              days: DayEntry[];
              totals: BaseTotals;
            }
          >;
          totals: BaseTotals;
        }
      >;
      totals: YearTotals;
    }
  >();

  const current = new Date(startDate);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const dateStr = toLocalDateString(current);
    const dayOfWeek = current.getDay();

    // Ensure year
    if (!yearsMap.has(year)) {
      yearsMap.set(year, { year, months: new Map(), totals: createYearTotals() });
    }
    const yearData = yearsMap.get(year)!;

    // Ensure month
    if (!yearData.months.has(month)) {
      yearData.months.set(month, {
        month,
        monthName: MONTH_NAMES[month - 1],
        weeks: new Map(),
        totals: createBaseTotals(),
      });
    }
    const monthData = yearData.months.get(month)!;

    // Calculate week boundaries CLIPPED to this month
    const isoMonday = getWeekMonday(current);
    const isoSunday = new Date(isoMonday);
    isoSunday.setDate(isoMonday.getDate() + 6);

    const monthFirst = new Date(year, month - 1, 1);
    const monthLast = new Date(year, month - 1, getLastDayOfMonth(year, month));

    const effectiveStart = isoMonday < monthFirst ? monthFirst : isoMonday;
    const effectiveEnd = isoSunday > monthLast ? monthLast : isoSunday;

    const weekKey = toLocalDateString(effectiveStart);

    if (!monthData.weeks.has(weekKey)) {
      monthData.weeks.set(weekKey, {
        weekNumber: getISOWeekNumber(current),
        startDate: toLocalDateString(effectiveStart),
        endDate: toLocalDateString(effectiveEnd),
        days: [],
        totals: createBaseTotals(),
      });
    }
    const weekData = monthData.weeks.get(weekKey)!;

    // Create day entry
    const dayActivities = activitiesByDate.get(dateStr) || null;
    weekData.days.push({
      date: dateStr,
      dayOfWeek,
      isRestDay: !dayActivities || dayActivities.length === 0,
      activities: dayActivities,
    });

    // Update totals
    if (dayActivities) {
      for (const act of dayActivities) {
        const targets = [weekData.totals, monthData.totals, yearData.totals, globalTotals];
        for (const t of targets) {
          t.distance_meters += act.distance_meters || 0;
          t.duration_seconds += act.duration_seconds || 0;
          t.elevation_gain_meters += act.elevation_gain_meters || 0;
          t.activities_count += 1;
        }
        if (act.workout_type === "race") {
          yearData.totals.races_count += 1;
          globalTotals.races_count += 1;
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  // 4. Convert to arrays and sort
  const years: YearEntry[] = Array.from(yearsMap.values())
    .map((y): YearEntry => {
      const months: MonthEntry[] = Array.from(y.months.values())
        .map((m): MonthEntry => {
          const weeks: WeekEntry[] = Array.from(m.weeks.values())
            .map(
              (w): WeekEntry => ({
                ...w,
                // Sort days DESCENDING (Sunday → Monday)
                days: w.days.sort((a, b) => b.date.localeCompare(a.date)),
              })
            )
            // Sort weeks descending (latest week first)
            .sort((a, b) => b.startDate.localeCompare(a.startDate));

          return { ...m, weeks };
        })
        // Sort months descending
        .sort((a, b) => b.month - a.month);

      return { ...y, months };
    })
    // Sort years descending
    .sort((a, b) => b.year - a.year);

  return { years, totals: globalTotals };
}

export function calculateAvgSpeed(distanceMeters: number, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  return distanceMeters / durationSeconds;
}
