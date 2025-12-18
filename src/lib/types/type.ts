export const phaseTypes = ["base", "build", "peak", "taper", "recovery", "off"] as const;
export type PhaseType = (typeof phaseTypes)[number];
export type ActivityType = "run" | "trail" | "treadmill" | "walk" | "hike" | "bike" | "swim" | "strength" | "cross_training";
export const raceTypes = ["run", "half_marathon", "marathon", "ultra_marathon", "triathlon", "trail", "ultra_trail"] as const;
export type RaceType = (typeof raceTypes)[number];
export type WorkoutType = "easy_run" | "hills" | "long_run" | "tempo" | "threshold" | "intervals" | "race" | "other";
