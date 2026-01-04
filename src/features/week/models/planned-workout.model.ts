import type { ActivityType, WorkoutType } from "@/lib/types/type";

export interface PlannedWorkoutModel {
  id: string;
  user_id: string;
  planned_date: string;
  time_slot: TimeSlot;
  activity_type: ActivityType;
  workout_type?: WorkoutType;
  target_distance_meters?: number | null;
  target_duration_seconds?: number | null;
  description?: string | null;
  activity_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type TimeSlot = "am" | "pm" | "single";

export type CreatePlannedWorkoutModel = Omit<PlannedWorkoutModel, "id" | "user_id" | "created_at" | "updated_at">;
export type CreatePlannedWorkoutWithUserModel = Omit<PlannedWorkoutModel, "id" | "created_at" | "updated_at">;
export type UpdatePlannedWorkoutModel = Partial<Omit<PlannedWorkoutModel, "id" | "user_id" | "created_at" | "updated_at">>;
