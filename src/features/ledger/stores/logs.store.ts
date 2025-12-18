import { create } from "zustand";

// =============================================================================
// Types
// =============================================================================

interface LogsState {
  initial: null;
  setInitial: (initial: null) => void;
}

// =============================================================================
// Store
// =============================================================================

export const useLogsStore = create<LogsState>((set) => ({
  initial: null,
  setInitial: (initial) => set({ initial: initial }),
}));
