export const activityTypes = ["run", "trail", "treadmill", "hike", "bike", "swim", "strength", "cross_training", "rest_day"] as const;
export const trainingEffectLabels = ["RECOVERY", "AEROBIC_BASE", "TEMPO", "LACTATE_THRESHOLD", "VO2MAX", "ANAEROBIC", "OVERREACHING"] as const;
export const phaseTypes = ["base", "build", "peak", "taper", "recovery", "off"] as const;
export const workoutTypes = ["easy_run", "hills", "long_run", "tempo", "threshold", "intervals", "race", "base_endurance", "uncategorized", "other"] as const;
export const raceTypes = ["run", "half_marathon", "marathon", "ultra_marathon", "triathlon", "trail", "ultra_trail"] as const;
export const rpe = [1, 2, 3, 4, 5] as const;

export type PhaseType = (typeof phaseTypes)[number];
export type ActivityType = (typeof activityTypes)[number];
export type RaceType = (typeof raceTypes)[number];
export type WorkoutType = (typeof workoutTypes)[number];
export type PriorityType = 1 | 2 | 3;
export type ActivitySource = "manual" | "strava" | "garmin";
export type TrainingEffectLabel = (typeof trainingEffectLabels)[number];
export type RPE = (typeof rpe)[number];
