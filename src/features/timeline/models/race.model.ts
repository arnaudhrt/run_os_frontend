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
  result_place_overall?: number;
  result_place_gender?: number;
  result_place_category?: number;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export type CreateRaceModel = Omit<
  RaceModel,
  | "id"
  | "user_id"
  | "is_completed"
  | "result_time_seconds"
  | "result_place_overall"
  | "result_place_gender"
  | "result_place_category"
  | "category_name"
  | "created_at"
  | "updated_at"
>;
export interface UpdateRaceModel {
  name?: string;
  race_date?: string;
  race_type?: RaceType;
  priority?: 1 | 2 | 3;
  is_completed?: boolean;
  elevation_gain_meters?: number;
  distance_meters?: number;
  target_time_seconds?: number;
  location?: string;
  notes?: string;
  result_time_seconds?: number;
  result_place_overall?: number;
  result_place_gender?: number;
  result_place_category?: number;
  category_name?: string;
}
