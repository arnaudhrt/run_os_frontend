import { Area, AreaChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/lib/ui/chart";
import type { WeeklyStats } from "../models/training-cycle.model";

function formatValue(value: number, dataKey: string): string {
  switch (dataKey) {
    case "volume":
      return `${value.toLocaleString()} km`;
    case "elevation":
      return `${value.toLocaleString()} m`;
    case "time": {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    default:
      return value.toLocaleString();
  }
}

interface VolumeChartProps {
  width: number;
  height: number;
  selection: string;
  data: WeeklyStats[];
  weekWidth: number;
}

const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--color-blue-500)",
  },
  elevation: {
    label: "Elevation",
    color: "var(--color-orange-500)",
  },
  time: {
    label: "Time",
    color: "var(--color-purple-500)",
  },
} satisfies ChartConfig;

export function VolumeChart({ width, height, selection, data, weekWidth }: VolumeChartProps) {
  // Add half weekWidth padding on each side so data points align with week grid lines
  const halfWeek = weekWidth / 2;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart accessibilityLayer data={data} width={width} height={height} margin={{ top: 0, right: halfWeek, left: halfWeek, bottom: 10 }}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex w-full justify-between gap-2">
                  <span className="font-mono font-medium">{formatValue(value as number, name as string)}</span>
                </div>
              )}
            />
          }
        />

        <defs>
          <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-blue-500)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-blue-200)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillElevation" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-orange-500)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-orange-200)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-purple-500)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-purple-200)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {selection === "volume" && (
          <Area dataKey="volume" type="natural" fill="url(#fillVolume)" fillOpacity={0.4} stroke="var(--color-blue-500)" stackId="a" />
        )}
        {selection === "elevation" && (
          <Area dataKey="elevation" type="natural" fill="url(#fillElevation)" fillOpacity={0.4} stroke="var(--color-orange-500)" stackId="a" />
        )}
        {selection === "time" && (
          <Area dataKey="time" type="natural" fill="url(#fillTime)" fillOpacity={0.4} stroke="var(--color-purple-500)" stackId="a" />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
