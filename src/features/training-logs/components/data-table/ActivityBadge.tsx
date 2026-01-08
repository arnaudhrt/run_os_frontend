import type { ActivityType } from "@/lib/types/type";
import { Badge } from "@/lib/ui/badge";

type ActvityAndRestDay = ActivityType | "rest_day";
interface ActivityBadgeProps {
  type: ActvityAndRestDay;
}

export function ActivityBadge({ type }: ActivityBadgeProps) {
  // Mapping styles to activity types
  const styles: Record<ActvityAndRestDay, { label: string; className: string }> = {
    run: {
      label: "run",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent",
    },
    trail: {
      label: "trail",
      className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent",
    },
    treadmill: {
      label: "treadmill",
      className: "bg-slate-100 text-slate-600 hover:bg-slate-100 border-transparent",
    },
    hike: {
      label: "hike",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent",
    },
    strength: {
      label: "strength",
      className: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-transparent",
    },
    cardio: {
      label: "strength",
      className: "bg-pink-100 text-pink-700 hover:bg-pink-100 border-transparent",
    },
    rest_day: {
      label: "rest",
      className: "bg-slate-600 text-white hover:bg-slate-600 border-transparent",
    },
  };

  const { label, className } = styles[type];

  return (
    <Badge variant="outline" className={`text-xs font-medium uppercase tracking-wider ${className}`}>
      {label}
    </Badge>
  );
}
