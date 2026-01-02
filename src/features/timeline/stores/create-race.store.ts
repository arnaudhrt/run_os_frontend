import { create } from "zustand";
import type { RaceType } from "@/lib/types/type";

interface CreateRaceState {
  // Wizard state
  step: number;
  direction: "forward" | "backward";

  // Form data
  name: string;
  raceDate: string;
  raceType: RaceType;
  priority: 1 | 2 | 3;
  distance: string;
  elevation: string;

  // Actions
  setStep: (step: number) => void;
  setDirection: (direction: "forward" | "backward") => void;
  setName: (name: string) => void;
  setRaceDate: (date: string) => void;
  setRaceType: (type: RaceType, prefillDistance?: boolean) => void;
  setPriority: (priority: 1 | 2 | 3) => void;
  setDistance: (distance: string) => void;
  setElevation: (elevation: string) => void;

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
  name: "",
  raceDate: getInitialDate(),
  raceType: "run" as RaceType,
  priority: 1 as const,
  distance: "",
  elevation: "",
};

export const useCreateRaceStore = create<CreateRaceState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setDirection: (direction) => set({ direction }),
  setName: (name) => set({ name }),
  setRaceDate: (raceDate) => set({ raceDate }),
  setRaceType: (raceType, prefillDistance = true) => {
    const distancePrefills: Partial<Record<RaceType, string>> = {
      marathon: "42.195",
      half_marathon: "21.0975",
    };
    set((state) => ({
      raceType,
      distance: prefillDistance && distancePrefills[raceType] ? distancePrefills[raceType] : state.distance,
    }));
  },
  setPriority: (priority) => set({ priority }),
  setDistance: (distance) => set({ distance }),
  setElevation: (elevation) => set({ elevation }),

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

  reset: () => set({ ...initialState, raceDate: getInitialDate() }),
}));
