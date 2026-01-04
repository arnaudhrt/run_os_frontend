import { useMemo } from "react";
import type { TrainingCycleModel } from "../models/training-cycle.model";
import { formatPhaseType, getCurrentPhase } from "../utils/timeline.utils";
import { headerPhaseColors } from "../utils/training-cycle.const";
import { cn } from "@/lib/utils";

interface TimelineHeaderProps {
  trainingCycles: TrainingCycleModel[];
}

export default function TimelineHeader({ trainingCycles }: TimelineHeaderProps) {
  const currentPhase = useMemo(() => getCurrentPhase(trainingCycles, new Date()), [trainingCycles]);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Timeline</h1>
        <p className="text-muted-foreground">
          Detailed, visual representation of your running journey, highlighting races, training phases, weekly volume and elevation targets.
        </p>
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
