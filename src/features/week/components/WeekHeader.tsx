import { useMemo } from "react";
import type { TrainingCycleModel } from "@/features/timeline/models/training-cycle.model";
import { formatPhaseType, getCurrentPhase } from "@/features/timeline/utils/timeline.utils";
import { headerPhaseColors } from "@/features/timeline/utils/training-cycle.const";
import { cn } from "@/lib/utils";

interface WeekHeaderProps {
  trainingCycles: TrainingCycleModel[];
}

export function WeekHeader({ trainingCycles }: WeekHeaderProps) {
  const currentPhase = useMemo(() => getCurrentPhase(trainingCycles, new Date()), [trainingCycles]);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Weekly Plan</h1>
        <p className="text-muted-foreground">Plan your week, review your progress.</p>
      </div>
      {currentPhase && (
        <div className={cn("border rounded-lg px-4 py-3 min-w-40", headerPhaseColors[currentPhase.phase.phase_type])}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Training Phase</p>
          <p className="font-semibold">{formatPhaseType(currentPhase.phase.phase_type)}</p>
          <p className="text-sm text-muted-foreground">
            Week {currentPhase.weekNumber}/{currentPhase.totalWeeks}
          </p>
        </div>
      )}
    </div>
  );
}
