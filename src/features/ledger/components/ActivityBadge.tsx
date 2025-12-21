import type { ActivityType } from "@/lib/types/type";
import { Badge } from "@/lib/ui/badge";

interface ActivityBadgeProps {
  type: ActivityType;
}

export function ActivityBadge({ type }: ActivityBadgeProps) {
  // Mapping styles to activity types
  const styles: Record<ActivityType, { label: string; className: string }> = {
    run: {
      label: "run",

      className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent",
    },
    trail: {
      label: "trail",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent",
    },
    treadmill: {
      label: "treadmill",
      className: "bg-slate-100 text-slate-600 hover:bg-slate-100 border-transparent",
    },
    walk: {
      label: "walk",
      className: "bg-stone-100 text-stone-600 hover:bg-stone-100 border-transparent",
    },
    hike: {
      label: "hike",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent",
    },
    bike: {
      label: "bike",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent",
    },
    swim: {
      label: "swim",
      className: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border-transparent",
    },
    strength: {
      label: "strength",
      className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-transparent",
    },
    cross_training: {
      label: "xt",
      className: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-transparent",
    },
  };

  const { label, className } = styles[type] || styles.run;

  return (
    <Badge variant="outline" className={`text-[10px] leading-0 font-medium uppercase tracking-wider ${className}`}>
      {label}
    </Badge>
  );
}
