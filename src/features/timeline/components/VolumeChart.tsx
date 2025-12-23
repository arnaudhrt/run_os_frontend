import { Area, AreaChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/lib/ui/chart";

interface VolumeChartProps {
  width: number;
  height: number;
  selection: string;
}

// Static volume chart data (weekly volume in km)
const chartData = [
  { week: "W1", volume: 45, elevation: 42 },
  { week: "W2", volume: 50, elevation: 24 },
  { week: "W3", volume: 55, elevation: 52 },
  { week: "W4", volume: 40, elevation: 38 },
  { week: "W5", volume: 60, elevation: 58 },
  { week: "W6", volume: 65, elevation: 32 },
  { week: "W7", volume: 70, elevation: 68 },
  { week: "W8", volume: 50, elevation: 45 },
  { week: "W9", volume: 75, elevation: 72 },
  { week: "W10", volume: 80, elevation: 78 },
  { week: "W11", volume: 85, elevation: 80 },
  { week: "W12", volume: 60, elevation: 55 },
  { week: "W13", volume: 90, elevation: 88 },
  { week: "W14", volume: 95, elevation: 92 },
  { week: "W15", volume: 100, elevation: 95 },
  { week: "W16", volume: 70, elevation: 25 },
  { week: "W17", volume: 105, elevation: 130 },
  { week: "W18", volume: 110, elevation: 85 },
  { week: "W19", volume: 115, elevation: 90 },
  { week: "W20", volume: 80, elevation: 75 },
  { week: "W21", volume: 120, elevation: 105 },
  { week: "W22", volume: 125, elevation: 100 },
  { week: "W23", volume: 130, elevation: 115 },
  { week: "W24", volume: 90, elevation: 85 },
];

const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--color-blue-500)",
  },
  elevation: {
    label: "Elevation",
    color: "var(--color-orange-500)",
  },
} satisfies ChartConfig;

export function VolumeChart({ width, height, selection }: VolumeChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart accessibilityLayer data={chartData} width={width} height={height} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-blue-500)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-blue-200)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillElevation" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-orange-500)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-orange-200)" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {selection === "volume" && (
          <Area dataKey="volume" type="natural" fill="url(#fillVolume)" fillOpacity={0.4} stroke="var(--color-blue-500)" stackId="a" />
        )}
        {selection === "elevation" && (
          <Area dataKey="elevation" type="natural" fill="url(#fillElevation)" fillOpacity={0.4} stroke="var(--color-orange-500)" stackId="a" />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
