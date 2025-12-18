import type { PhaseType } from "@/lib/types/type";

export interface PhaseModel {
  id: string;
  user_id: string;
  phase_type: PhaseType;
  start_date: string;
  end_date: string;
  race_id?: string;
  description?: string;
  weekly_volume_target_km?: number;
  weekly_elevation_target_m?: number;
  created_at: string;
  updated_at: string;
}

export type CreatePhaseModel = Omit<PhaseModel, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdatePhaseModel = Partial<Omit<PhaseModel, "id" | "user_id" | "created_at" | "updated_at">>;
