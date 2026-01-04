import { Progress } from "@/lib/ui/progress";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  planned: string;
  actual: string;
  percent: number;
}

export default function SummaryCard({ label, planned, actual, percent }: SummaryCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-xl font-semibold">{actual}</span>
        <span className="text-sm text-muted-foreground">/ {planned}</span>
      </div>
      <Progress value={Math.min(percent, 100)} className="h-1.5" />
      <p className={cn("text-xs mt-1.5", percent >= 100 ? "text-green-600" : percent >= 80 ? "text-amber-600" : "text-muted-foreground")}>
        {percent}%
      </p>
    </div>
  );
}
