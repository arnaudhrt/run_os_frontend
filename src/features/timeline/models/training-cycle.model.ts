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
    order: number;
    phase_type: PhaseType;
    duration_weeks: number;
  }[];
}

export interface WeeklyStats {
  week: string; // format: "2025W1"
  volume: number; // distance in km
  elevation: number; // elevation gain in meters
  time: number; // duration in seconds
}
