import type { PhaseType } from "@/lib/types/type";

export type ZoomMode = "3m" | "6m" | "9m";

export const HEADER_HEIGHT = 64;
export const RACE_TRACK_HEIGHT = 80;
export const PHASE_TRACK_HEIGHT = 60;
export const CHART_TRACK_HEIGHT = 150;
export const TOTAL_WEEKS = 104; // 2 years
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export const ZOOM_CONFIG: Record<ZoomMode, { visibleWeeks: number; label: string }> = {
  "3m": { visibleWeeks: 13, label: "3 Months" },
  "6m": { visibleWeeks: 26, label: "6 Months" },
  "9m": { visibleWeeks: 39, label: "9 Months" },
};

export const ZOOM_MODES: ZoomMode[] = ["3m", "6m", "9m"];

export const phaseColors: Record<PhaseType, { bg: string; border: string; text: string }> = {
  base: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-900" },
  build: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-900" },
  peak: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-900" },
  taper: { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-900" },
  recovery: { bg: "bg-zinc-50", border: "border-zinc-500", text: "text-zinc-900" },
  off: { bg: "bg-zinc-50", border: "border-zinc-500", text: "text-zinc-900" },
};
