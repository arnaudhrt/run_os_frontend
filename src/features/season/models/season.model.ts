import type { PhaseType, RaceType } from "@/lib/types/type";

export interface SeasonModel {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  races: RaceModel[];
  created_at: string;
  updated_at: string;
}

export interface RaceModel {
  id: string;
  season_id: string;
  name: string;
  race_date: string;
  distance_meters?: number;
  elevation_gain_meters?: number;
  target_time_seconds?: number;
  location?: string;
  race_type: RaceType;
  priority: 1 | 2 | 3;
  notes?: string;
  result_time_seconds?: number;
  result_place?: string;
  is_completed: boolean;
  phases: PhaseModel[];
  created_at: string;
  updated_at: string;
}

export interface PhaseModel {
  id: string;
  race_id: string;
  phase_type: PhaseType;
  start_date: string;
  end_date: string;
  description?: string;
  weekly_volume_target_km?: number;
  weekly_elevation_target_m?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSeasonModel {
  name: string;
  start_date: string;
  end_date: string;
}

export interface CreateRaceModel {
  season_id: string;
  name: string;
  race_date: string;
  distance_meters?: number;
  elevation_gain_meters?: number;
  target_time_seconds?: number;
  location?: string;
  race_type: RaceType;
  priority: 1 | 2 | 3;
  notes?: string;
}

export interface CreatePhaseModel {
  race_id: string;
  phase_type: PhaseType;
  start_date: string;
  end_date: string;
  description?: string;
  weekly_volume_target_km?: number;
  weekly_elevation_target_m?: number;
}

export interface UpdateSeasonModel {
  name?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateRaceModel {
  name?: string;
  race_date?: string;
  distance_meters?: number;
  elevation_gain_meters?: number;
  target_time_seconds?: number;
  location?: string;
  race_type?: RaceType;
  priority?: 1 | 2 | 3;
  notes?: string;
  result_time_seconds?: number;
  result_place?: string;
  is_completed?: boolean;
}

export interface UpdatePhaseModel {
  phase_type?: PhaseType;
  start_date?: string;
  end_date?: string;
  description?: string;
  weekly_volume_target_km?: number;
  weekly_elevation_target_m?: number;
}
