import { create } from "zustand";

export type OrderFilter = "asc" | "desc";

interface FilterActivityState {
  order: OrderFilter;
  setOrder: (order: OrderFilter) => void;
}

export const useFilterActivityStore = create<FilterActivityState>((set) => ({
  order: "asc",
  setOrder: (order) => set({ order }),
}));
