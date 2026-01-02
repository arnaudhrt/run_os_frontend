import type { PhaseType } from "@/lib/types/type";

export interface PhaseModel {
  id: string;
  cycle_id: string;
  phase_type: PhaseType;
  order: number;
  duration_weeks: number;
  created_at: string;
  updated_at: string;
}

/** Computed phase with dates calculated from training cycle start_date and phase order/duration */
export interface ComputedPhaseModel extends PhaseModel {
  start_date: string;
  end_date: string;
}
