import { useMemo } from "react";
import { Timer, Map, Mountain, Trophy, type LucideIcon } from "lucide-react";
import { formatDistance, formatDuration, formatElevation } from "../utils/format";
import { cn } from "@/lib/utils";

interface StatsSummaryProps {
  distance: number;
  duration: number;
  elevation: number;
  raceCount: number;
  className?: string;
  isLifetime?: boolean;
}

export function StatsSummary({ distance, duration, elevation, raceCount, className, isLifetime = false }: StatsSummaryProps) {
  const stats = useMemo(
    () => [
      {
        label: "Distance",
        value: formatDistance(distance),
        icon: Map,
        color: "text-blue-500",
      },
      {
        label: "Time",
        value: formatDuration(duration),
        icon: Timer,
        color: "text-emerald-500",
      },
      {
        label: "Elevation",
        value: `+${formatElevation(elevation)}`,
        icon: Mountain,
        color: "text-amber-500",
      },
      {
        label: "Races",
        value: raceCount.toString(),
        icon: Trophy,
        color: "text-purple-500",
        highlight: raceCount > 0,
        hide: raceCount < 0,
      },
    ],
    [distance, duration, elevation, raceCount]
  );

  return (
    <div className={cn("w-full max-w-2xl", isLifetime && "py-4 px-3 rounded-lg border bg-card", className)}>
      {isLifetime && <p className="text-sm font-semibold pl-2 mb-4 text-muted-foreground uppercase tracking-tight">Lifetime Total</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-4">
        {stats
          .filter((s) => !s.hide)
          .map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              iconColor={stat.color}
              highlight={stat.highlight}
              showBorder={index !== 0}
            />
          ))}
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
  highlight?: boolean;
  showBorder?: boolean;
}

function StatItem({ icon: Icon, label, value, iconColor, highlight, showBorder }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 px-3 transition-colors border-muted", showBorder && "border-l-2")}>
      <div className="flex items-center gap-2">
        <Icon size={14} className={cn("shrink-0", iconColor)} />
        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 whitespace-nowrap">{label}</span>
      </div>
      <div className={cn("text-lg font-mono font-black tracking-tighter leading-none", highlight ? "text-purple-600" : "text-foreground")}>
        {value}
      </div>
    </div>
  );
}
