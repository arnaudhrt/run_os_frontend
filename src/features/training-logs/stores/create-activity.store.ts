import { create } from "zustand";
import type { ActivityType, WorkoutType } from "@/lib/types/type";

interface CreateActivityState {
  // Wizard state
  step: number;
  direction: "forward" | "backward";

  // Form data
  activityType: ActivityType;
  workoutType: WorkoutType;
  startTime: string;
  distance: string;
  hours: string;
  minutes: string;
  seconds: string;

  // Optional fields
  elevation: string;
  avgHeartRate: string;
  maxHeartRate: string;
  rpe: string;
  notes: string;

  // Actions
  setActivityType: (type: ActivityType) => void;
  setWorkoutType: (type: WorkoutType) => void;
  setStartTime: (time: string) => void;
  setDistance: (distance: string) => void;
  setHours: (hours: string) => void;
  setMinutes: (minutes: string) => void;
  setSeconds: (seconds: string) => void;
  setElevation: (elevation: string) => void;
  setAvgHeartRate: (hr: string) => void;
  setMaxHeartRate: (hr: string) => void;
  setRpe: (rpe: string) => void;
  setNotes: (notes: string) => void;

  // Navigation
  goNext: () => void;
  goBack: () => void;

  // Reset
  reset: () => void;
}

const getInitialDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const initialState = {
  step: 0,
  direction: "forward" as const,
  activityType: "run" as ActivityType,
  workoutType: "base_run" as WorkoutType,
  startTime: getInitialDateTime(),
  distance: "",
  hours: "",
  minutes: "",
  seconds: "",
  elevation: "",
  avgHeartRate: "",
  maxHeartRate: "",
  rpe: "",
  notes: "",
};

export const useCreateActivityStore = create<CreateActivityState>((set) => ({
  ...initialState,

  setActivityType: (activityType) => {
    // Reset workout type when activity type changes
    const defaultWorkoutType: Record<ActivityType, WorkoutType> = {
      run: "base_run",
      trail: "base_run",
      treadmill: "base_run",
      hike: "base_run",
      strength: "full_body",
      cardio: "other",
    };
    set({ activityType, workoutType: defaultWorkoutType[activityType] });
  },
  setWorkoutType: (workoutType) => set({ workoutType }),
  setStartTime: (startTime) => set({ startTime }),
  setDistance: (distance) => set({ distance }),
  setHours: (hours) => set({ hours }),
  setMinutes: (minutes) => set({ minutes }),
  setSeconds: (seconds) => set({ seconds }),
  setElevation: (elevation) => set({ elevation }),
  setAvgHeartRate: (avgHeartRate) => set({ avgHeartRate }),
  setMaxHeartRate: (maxHeartRate) => set({ maxHeartRate }),
  setRpe: (rpe) => set({ rpe }),
  setNotes: (notes) => set({ notes }),

  goNext: () =>
    set((state) => ({
      direction: "forward",
      step: state.step + 1,
    })),

  goBack: () =>
    set((state) => ({
      direction: "backward",
      step: Math.max(0, state.step - 1),
    })),

  reset: () => set({ ...initialState, startTime: getInitialDateTime() }),
}));
