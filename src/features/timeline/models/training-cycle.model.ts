import type { PhaseType } from "@/lib/types/type";
import type { PhaseModel } from "./phase.model";

export interface TrainingCycleModel {
  id: string;
  user_id: string;
  race_id?: string;
  name: string;
  start_date: string;
  end_date: string;
  total_weeks: number;
  phases: PhaseModel[];
  created_at: string;
  updated_at: string;
}
export interface CreateTrainingCycleModel {
  race_id?: string;
  name: string;
  start_date: string;
  end_date: string;
  phases: {
    phase_type: PhaseType;
    duration_weeks: number;
  }[];
}
