import type { ActivityType, DataSource, WorkoutType } from "@/lib/types/type";

export interface ActivityModel {
  id: string;
  user_id: string;
  source: DataSource;
  garmin_activity_id?: string;
  strava_activity_id?: number;

  activity_type: ActivityType;
  workout_type?: WorkoutType;
  start_time: string;

  distance_meters?: number;
  duration_seconds?: number;

  elevation_gain_meters?: number;

  avg_heart_rate?: number;
  max_heart_rate?: number;

  avg_temperature_celsius?: number;

  is_pr?: boolean;
  has_pain?: string;
  rpe?: number;
  notes?: string;
  shoes_id?: string;

  created_at: string;
  updated_at: string;
}

export interface ActivitiesResponse {
  activities: ActivityModel[];
  min_date: string;
  max_date: string;
}

export type UpdateActivityModel = Partial<Omit<ActivityModel, "id" | "user_id" | "created_at" | "updated_at">>;

export type CreateActivityModel = Omit<ActivityModel, "id" | "user_id" | "created_at" | "updated_at">;

export interface DayEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isRestDay: boolean;
  activities: ActivityModel[] | null;
}

export interface WeekEntry {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DayEntry[] | null; // null if all 7 days are rest days
  totals: {
    distance_meters: number;
    duration_seconds: number;
    elevation_gain_meters: number;
    activities_count: number;
  };
}

export interface MonthEntry {
  month: number; // 1-12
  monthName: string;
  weeks: WeekEntry[] | null; // null if all weeks are empty
  totals: {
    distance_meters: number;
    duration_seconds: number;
    elevation_gain_meters: number;
    activities_count: number;
  };
}

export interface YearEntry {
  year: number;
  months: MonthEntry[] | null; // null if all months are empty
  totals: {
    distance_meters: number;
    duration_seconds: number;
    elevation_gain_meters: number;
    activities_count: number;
    races_count: number;
  };
}

export interface StructuredActivitiesLog {
  years: YearEntry[];
  totals: {
    distance_meters: number;
    duration_seconds: number;
    elevation_gain_meters: number;
    activities_count: number;
    races_count: number;
  };
}
