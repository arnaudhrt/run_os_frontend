import type { RaceType } from "@/lib/types/type";

export interface RaceModel {
  id: string;
  user_id: string;
  name: string;
  race_date: string;
  race_type: RaceType;
  priority: 1 | 2 | 3;
  is_completed: boolean;
  elevation_gain_meters?: number;
  distance_meters?: number;
  target_time_seconds?: number;
  location?: string;
  notes?: string;
  result_time_seconds?: number;
  result_place?: string;
  created_at: string;
  updated_at: string;
}

export type CreateRaceModel = Omit<
  RaceModel,
  "id" | "user_id" | "is_completed" | "result_time_seconds" | "result_place" | "created_at" | "updated_at"
>;
export type UpdateRaceModel = Partial<Omit<RaceModel, "id" | "user_id" | "created_at" | "updated_at">>;
