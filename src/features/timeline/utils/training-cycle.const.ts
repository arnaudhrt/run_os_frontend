import type { PhaseType } from "@/lib/types/type";

export const TOTAL_STEPS = 4;

export const phaseColors: Record<PhaseType, string> = {
  base: "bg-blue-100 border-blue-500 text-blue-900",
  build: "bg-amber-100 border-amber-500 text-amber-900",
  peak: "bg-purple-100 border-purple-500 text-purple-900",
  taper: "bg-emerald-100 border-emerald-500 text-emerald-900",
  recovery: "bg-zinc-100 border-zinc-500 text-zinc-900",
  off: "bg-zinc-100 border-zinc-500 text-zinc-900",
};

export const headerPhaseColors: Record<PhaseType, string> = {
  base: "bg-blue-50 border-blue-500",
  build: "bg-amber-50 border-amber-500",
  peak: "bg-purple-50 border-purple-500",
  taper: "bg-emerald-50 border-emerald-500",
  recovery: "bg-zinc-50 border-zinc-500",
  off: "bg-zinc-50 border-zinc-500",
};
