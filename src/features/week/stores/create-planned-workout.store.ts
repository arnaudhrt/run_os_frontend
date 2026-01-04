import { create } from "zustand";
import type { ActivityType, WorkoutType } from "@/lib/types/type";

interface CreatePlannedWorkoutState {
  // Wizard state
  step: number;
  direction: "forward" | "backward";

  // Form data
  plannedDate: string;
  timeSlot: "am" | "pm" | "single";
  activityType: ActivityType;
  workoutType: WorkoutType;
  targetDistance: string; // in km
  targetDuration: string; // format: "HH:MM:SS"
  description: string;

  // Actions
  setStep: (step: number) => void;
  setDirection: (direction: "forward" | "backward") => void;
  setPlannedDate: (date: string) => void;
  setTimeSlot: (slot: "am" | "pm" | "single") => void;
  setActivityType: (type: ActivityType) => void;
  setWorkoutType: (type: WorkoutType) => void;
  setTargetDistance: (distance: string) => void;
  setTargetDuration: (duration: string) => void;
  setDescription: (description: string) => void;

  // Navigation
  goNext: () => void;
  goBack: () => void;

  // Reset
  reset: () => void;
}

const getInitialDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

const initialState = {
  step: 0,
  direction: "forward" as const,
  plannedDate: getInitialDate(),
  timeSlot: "single" as const,
  activityType: "run" as ActivityType,
  workoutType: "easy_run" as WorkoutType,
  targetDistance: "",
  targetDuration: "",
  description: "",
};

export const useCreatePlannedWorkoutStore = create<CreatePlannedWorkoutState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setDirection: (direction) => set({ direction }),
  setPlannedDate: (plannedDate) => set({ plannedDate }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setActivityType: (activityType) => set({ activityType }),
  setWorkoutType: (workoutType) => set({ workoutType }),
  setTargetDistance: (targetDistance) => set({ targetDistance }),
  setTargetDuration: (targetDuration) => set({ targetDuration }),
  setDescription: (description) => set({ description }),

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

  reset: () => set({ ...initialState, plannedDate: getInitialDate() }),
}));
