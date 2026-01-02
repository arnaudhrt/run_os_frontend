import { create } from "zustand";
import type { PhaseType } from "@/lib/types/type";

type EndDateMode = "race" | "manual";

export interface PhaseConfig {
  phaseType: PhaseType;
  durationWeeks: number;
}

interface CreateTrainingCycleState {
  // Wizard state
  step: number;
  direction: "forward" | "backward";

  // Step 1: Name
  name: string;

  // Step 2: End date
  endDateMode: EndDateMode;
  raceId: string;
  raceDate: Date | null;
  manualEndDate: Date;

  // Step 3: Start date
  startDate: Date;

  // Step 4: Phases
  phases: PhaseConfig[];
  phasesInitialized: boolean;

  // Actions
  setStep: (step: number) => void;
  setDirection: (direction: "forward" | "backward") => void;
  setName: (name: string) => void;
  setEndDateMode: (mode: EndDateMode) => void;
  setRaceId: (raceId: string, raceDate: Date) => void;
  setManualEndDate: (date: Date) => void;
  setStartDate: (date: Date) => void;
  initializePhases: (totalWeeks: number) => void;
  updatePhaseWeeks: (phaseType: PhaseType, weeks: number) => void;
  removePhase: (phaseType: PhaseType) => void;
  addPhase: (phaseType: PhaseType) => void;

  // Navigation
  goNext: () => void;
  goBack: () => void;

  // Computed
  getEndDate: () => Date;

  // Reset
  reset: () => void;
}

const getToday = () => {
  const now = new Date();
  return now;
};

const getDefaultEndDate = () => {
  const now = new Date();
  now.setMonth(now.getMonth() + 3);
  return now;
};

// Calculate default phase split: base 40%, build 30%, peak 15%, taper 15%
function calculateDefaultPhases(totalWeeks: number): PhaseConfig[] {
  const baseWeeks = Math.round(totalWeeks * 0.4);
  const buildWeeks = Math.round(totalWeeks * 0.3);
  const peakWeeks = Math.round(totalWeeks * 0.15);
  // Taper gets the remainder to ensure total matches
  const taperWeeks = totalWeeks - baseWeeks - buildWeeks - peakWeeks;

  return [
    { phaseType: "base", durationWeeks: baseWeeks },
    { phaseType: "build", durationWeeks: buildWeeks },
    { phaseType: "peak", durationWeeks: peakWeeks },
    { phaseType: "taper", durationWeeks: Math.max(1, taperWeeks) },
  ];
}

const initialState = {
  step: 0,
  direction: "forward" as const,
  name: "",
  endDateMode: "race" as EndDateMode,
  raceId: "",
  raceDate: null,
  manualEndDate: getDefaultEndDate(),
  startDate: getToday(),
  phases: [] as PhaseConfig[],
  phasesInitialized: false,
};

export const useCreateTrainingCycleStore = create<CreateTrainingCycleState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setDirection: (direction) => set({ direction }),
  setName: (name) => set({ name }),
  setEndDateMode: (endDateMode) => set({ endDateMode }),
  setRaceId: (raceId, raceDate) => set({ raceId, raceDate }),
  setManualEndDate: (manualEndDate) => set({ manualEndDate }),
  setStartDate: (startDate) => set({ startDate, phasesInitialized: false }),

  initializePhases: (totalWeeks) => {
    const state = get();
    if (!state.phasesInitialized) {
      set({
        phases: calculateDefaultPhases(totalWeeks),
        phasesInitialized: true,
      });
    }
  },

  updatePhaseWeeks: (phaseType, weeks) =>
    set((state) => ({
      phases: state.phases.map((p) => (p.phaseType === phaseType ? { ...p, durationWeeks: Math.max(1, weeks) } : p)),
    })),

  removePhase: (phaseType) =>
    set((state) => ({
      phases: state.phases.filter((p) => p.phaseType !== phaseType),
    })),

  addPhase: (phaseType) =>
    set((state) => ({
      phases: [...state.phases, { phaseType, durationWeeks: 1 }],
    })),

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

  getEndDate: () => {
    const state = get();
    if (state.endDateMode === "race" && state.raceDate) {
      return new Date(state.raceDate);
    }
    return state.manualEndDate;
  },

  reset: () => set({ ...initialState, manualEndDate: getDefaultEndDate(), startDate: getToday() }),
}));
