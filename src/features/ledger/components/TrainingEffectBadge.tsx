import type { TrainingEffectLabel } from "@/lib/types/type";
import { Badge } from "@/lib/ui/badge";

interface TrainingEffectBadgeProps {
  label: TrainingEffectLabel | undefined;
}

export function TrainingEffectBadge({ label }: TrainingEffectBadgeProps) {
  if (!label) return null;
  // Mapping styles to training effect labels
  const styles: Record<TrainingEffectLabel, { displayLabel: string; className: string }> = {
    RECOVERY: {
      displayLabel: "Recovery",
      className: "bg-green-100 text-green-700 hover:bg-green-100 border-transparent",
    },
    AEROBIC_BASE: {
      displayLabel: "Base",
      className: "bg-lime-100 text-lime-700 hover:bg-lime-100 border-transparent",
    },
    TEMPO: {
      displayLabel: "Tempo",
      className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-transparent",
    },
    LACTATE_THRESHOLD: {
      displayLabel: "Threshold",
      className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent",
    },
    VO2MAX: {
      displayLabel: "VO2 Max",
      className: "bg-red-100 text-red-700 hover:bg-red-100 border-transparent",
    },
    ANAEROBIC: {
      displayLabel: "Anaerobic",
      className: "bg-rose-100 text-rose-700 hover:bg-rose-100 border-transparent",
    },
    OVERREACHING: {
      displayLabel: "Overreaching",
      className: "bg-red-200 text-red-800 hover:bg-red-200 border-transparent",
    },
  };

  const { displayLabel, className } = styles[label];

  return (
    <Badge variant="outline" className={`text-xs font-medium tracking-wider ${className}`}>
      {displayLabel}
    </Badge>
  );
}
