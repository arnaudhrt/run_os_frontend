import type { ComputedPhaseModel } from "../models/phase.model";
import type { TrainingCycleModel } from "../models/training-cycle.model";
import { differenceInWeeks } from "date-fns";

export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function generateYearOptions(currentYear: number): number[] {
  const years: number[] = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push(y);
  }
  return years;
}

/** Compute phases with start_date and end_date from training cycles */
export function computePhasesFromCycles(trainingCycles: TrainingCycleModel[]): ComputedPhaseModel[] {
  const computedPhases: ComputedPhaseModel[] = [];

  for (const cycle of trainingCycles) {
    const cycleStartDate = new Date(cycle.start_date);
    // Sort phases by order to ensure correct sequence
    const sortedPhases = [...cycle.phases].sort((a, b) => a.order - b.order);

    let currentDate = cycleStartDate;

    for (const phase of sortedPhases) {
      const phaseStartDate = new Date(currentDate);
      const phaseEndDate = addWeeks(phaseStartDate, phase.duration_weeks);

      computedPhases.push({
        ...phase,
        start_date: phaseStartDate.toISOString(),
        end_date: phaseEndDate.toISOString(),
      });

      currentDate = phaseEndDate;
    }
  }

  return computedPhases;
}

interface CurrentPhaseInfo {
  phase: ComputedPhaseModel;
  cycleName: string;
  weekNumber: number;
  totalWeeks: number;
}

export function getCurrentPhase(trainingCycles: TrainingCycleModel[], today: Date): CurrentPhaseInfo | null {
  const computedPhases = computePhasesFromCycles(trainingCycles);

  for (const phase of computedPhases) {
    const startDate = new Date(phase.start_date);
    const endDate = new Date(phase.end_date);

    if (today >= startDate && today < endDate) {
      const cycle = trainingCycles.find((c) => c.id === phase.cycle_id);
      const weekNumber = differenceInWeeks(today, startDate) + 1;

      return {
        phase,
        cycleName: cycle?.name ?? "Training Cycle",
        weekNumber,
        totalWeeks: phase.duration_weeks,
      };
    }
  }

  return null;
}

export function formatPhaseType(phaseType: string): string {
  return phaseType.charAt(0).toUpperCase() + phaseType.slice(1);
}
