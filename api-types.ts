// ============================================
// API Types for React/Vite Frontend
// Generated from run_os_api endpoints
// ============================================

// ============================================
// Enums / Literal Types
// ============================================

export type PhaseType = "base" | "build" | "peak" | "taper" | "recovery" | "off";
export type ActivityType = "run" | "trail" | "treadmill" | "walk" | "hike" | "bike" | "swim" | "strength" | "cross_training";
export type RaceType = "run" | "half_marathon" | "marathon" | "ultra_marathon" | "triathlon" | "trail" | "ultra_trail";
export type WorkoutType = "easy_run" | "hills" | "long_run" | "tempo" | "threshold" | "intervals" | "race" | "other";

// ============================================
// Base API Response
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// Auth Models
// ============================================

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  firebase_uid: string;
  garmin_user_id?: string;
  strava_athlete_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  firebase_uid: string;
  garmin_user_id?: string;
  strava_athlete_id?: number;
}

// ============================================
// Season Models
// ============================================

// ============================================
// Activity Models
// ============================================

export interface Activity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  workout_type: WorkoutType;
  start_time: string;
  distance_meters?: number;
  duration_seconds?: number;
  elevation_gain_meters?: number;
  elevation_loss_meters?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  avg_pace_min_per_km?: number;
  best_pace_min_per_km?: number;
  avg_cadence?: number;
  rpe?: number;
  notes?: string;
  avg_temperature_celsius?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityRequest {
  activity_type: ActivityType;
  workout_type: WorkoutType;
  start_time: string;
  distance_meters?: number;
  duration_seconds?: number;
  elevation_gain_meters?: number;
  elevation_loss_meters?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  avg_pace_min_per_km?: number;
  best_pace_min_per_km?: number;
  avg_cadence?: number;
  rpe?: number;
  notes?: string;
  avg_temperature_celsius?: number;
}

export interface UpdateActivityRequest {
  activity_type?: ActivityType;
  workout_type?: WorkoutType;
  start_time?: string;
  distance_meters?: number;
  duration_seconds?: number;
  elevation_gain_meters?: number;
  elevation_loss_meters?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  avg_pace_min_per_km?: number;
  best_pace_min_per_km?: number;
  avg_cadence?: number;
  rpe?: number;
  notes?: string;
  avg_temperature_celsius?: number;
}

// ============================================
// Structured Activities Log (for Log Page)
// ============================================

export interface Totals {
  distance_meters: number;
  duration_seconds: number;
  elevation_gain_meters: number;
  activitiesCount: number;
}

export interface DayEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isRestDay: boolean;
  activity: Activity | null;
}

export interface WeekEntry {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DayEntry[] | null; // null if all 7 days are rest days
  totals: Totals;
}

export interface MonthEntry {
  month: number; // 1-12
  monthName: string;
  weeks: WeekEntry[] | null; // null if all weeks are empty
  totals: Totals;
}

export interface YearEntry {
  year: number;
  months: MonthEntry[] | null; // null if all months are empty
  totals: Totals;
}

export interface StructuredActivitiesLog {
  years: YearEntry[];
  totals: Totals;
}
