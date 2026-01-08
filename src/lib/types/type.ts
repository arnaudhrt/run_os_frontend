export const phaseTypes = ["base", "build", "peak", "taper", "recovery", "off"] as const;
export type PhaseType = (typeof phaseTypes)[number];

export const activityTypes = ["run", "trail", "treadmill", "hike", "strength", "cardio"] as const;
export type ActivityType = (typeof activityTypes)[number];

export const raceTypes = ["run", "5k", "10k", "half_marathon", "marathon", "ultra_marathon", "trail", "ultra_trail"] as const;
export type RaceType = (typeof raceTypes)[number];

export const runningWorkoutTypes = ["base_run", "hills", "long_run", "tempo", "threshold", "intervals", "race"] as const;
export type RunningWorkoutType = (typeof runningWorkoutTypes)[number];

export const strengthWorkoutTypes = [
  "full_body",
  "upper_body",
  "lower_body",
  "push",
  "pull",
  "legs",
  "chest",
  "back",
  "shoulders",
  "abs",
  "arms",
] as const;
export type StrengthWorkoutType = (typeof strengthWorkoutTypes)[number];

export const cardioWorkoutTypes = ["low_intensity", "moderate_intensity", "high_intensity", "race"] as const;
export type CardioWorkoutType = (typeof cardioWorkoutTypes)[number];

export const allWorkoutTypes = [...runningWorkoutTypes, ...strengthWorkoutTypes, ...cardioWorkoutTypes] as const;
export type WorkoutType = RunningWorkoutType | StrengthWorkoutType | CardioWorkoutType;

export const recordTypes = ["distance", "trail", "performance"] as const;
export type RecordType = (typeof recordTypes)[number];

export const chatRoles = ["user", "assistant", "system"] as const;
export type ChatRole = (typeof chatRoles)[number];

export const syncStatuses = ["running", "completed", "failed"] as const;
export type SyncStatus = (typeof syncStatuses)[number];

export const dataSources = ["manual", "strava", "garmin"] as const;
export type DataSource = (typeof dataSources)[number];

export const timeSlots = ["am", "pm", "single"] as const;
export type TimeSlot = (typeof timeSlots)[number];

export const rpe = [1, 2, 3, 4, 5] as const;
export type Rpe = (typeof rpe)[number];

export const racePriority = [1, 2, 3] as const;
export type RacePriority = (typeof racePriority)[number];

export const pain = ["knee", "back", "shoulder", "neck", "elbow", "wrist", "hip", "ankle", "foot", "toes", "calf", "shinbone"] as const;
export type Pain = (typeof pain)[number];

export interface ValidationResponse<T> {
  success: boolean;
  errors: Record<string, string> | null;
  data: T | null;
}
