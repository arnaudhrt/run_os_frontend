import type { PhaseType } from "@/lib/types/type";

export interface PhaseModel {
  id: string;
  user_id: string;
  phase_type: PhaseType;
  start_date: string;
  end_date: string;
  race_id?: string;
  created_at: string;
  updated_at: string;
}
