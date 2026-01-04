import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { Progress } from "@/lib/ui/progress";
import { cn } from "@/lib/utils";
import { CreatePlannedWorkoutDialog } from "../components/CreatePlannedWorkoutDialog";

// Static mock data for UI preview
const mockPhaseContext = {
  phaseName: "Build",
  weekNumber: 3,
  totalWeeks: 6,
  targetVolume: 65,
  targetElevation: 800,
};

const mockWeekData = {
  weekStart: "Dec 16, 2024",
  weekEnd: "Dec 22, 2024",
  weekNumber: 51,
  planned: {
    volume: 65,
    elevation: 800,
    sessions: 6,
    longRun: 22,
  },
  actual: {
    volume: 58.4,
    elevation: 720,
    sessions: 5,
    longRun: 20,
  },
  days: [
    { day: "Mon", planned: { type: "Easy", distance: 8 }, actual: { type: "Easy", distance: 8.2, duration: "48:00", avgHr: 142 } },
    { day: "Tue", planned: { type: "Intervals", distance: 10 }, actual: { type: "Intervals", distance: 9.5, duration: "52:00", avgHr: 158 } },
    { day: "Wed", planned: { type: "Rest", distance: 0 }, actual: null },
    { day: "Thu", planned: { type: "Tempo", distance: 12 }, actual: { type: "Tempo", distance: 11.8, duration: "58:00", avgHr: 165 } },
    { day: "Fri", planned: { type: "Easy", distance: 8 }, actual: { type: "Easy", distance: 8.4, duration: "50:00", avgHr: 140 } },
    { day: "Sat", planned: { type: "Long Run", distance: 22 }, actual: { type: "Long Run", distance: 20, duration: "2:05:00", avgHr: 148 } },
    { day: "Sun", planned: { type: "Recovery", distance: 5 }, actual: null },
  ],
};

function formatDuration(duration: string): string {
  return duration;
}

function getCompletionPercent(planned: number, actual: number): number {
  if (planned === 0) return 0;
  return Math.round((actual / planned) * 100);
}

export default function WeekPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [openCreateWorkoutDialog, setOpenCreateWorkoutDialog] = useState(false);

  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  const volumePercent = getCompletionPercent(mockWeekData.planned.volume, mockWeekData.actual.volume);
  const elevationPercent = getCompletionPercent(mockWeekData.planned.elevation, mockWeekData.actual.elevation);

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly Review</h1>
          <p className="text-muted-foreground">Plan your week, review your progress.</p>
        </div>
        <div className="border bg-amber-50 border-amber-500 rounded-lg px-4 py-3 min-w-40">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Training Phase</p>
          <p className="font-semibold">{mockPhaseContext.phaseName}</p>
          <p className="text-sm text-muted-foreground">
            Week {mockPhaseContext.weekNumber}/{mockPhaseContext.totalWeeks}
          </p>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-center min-w-48">
            <p className="font-semibold">
              {mockWeekData.weekStart} – {mockWeekData.weekEnd}
            </p>
            <p className="text-xs text-muted-foreground">
              Week {mockWeekData.weekNumber}
              {weekOffset === 0 && " (Current)"}
              {weekOffset === 1 && " (Next)"}
              {weekOffset === -1 && " (Last)"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {weekOffset !== 0 && (
            <Button variant="outline" size="sm" onClick={handleCurrentWeek}>
              Today
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="size-4 mr-1.5" />
            Sync
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => setOpenCreateWorkoutDialog(true)}>
            <Plus className="size-4 mr-1.5" />
            Create workout
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Volume"
          planned={`${mockWeekData.planned.volume} km`}
          actual={`${mockWeekData.actual.volume} km`}
          percent={volumePercent}
        />
        <SummaryCard
          label="Elevation"
          planned={`${mockWeekData.planned.elevation} m`}
          actual={`${mockWeekData.actual.elevation} m`}
          percent={elevationPercent}
        />
        <SummaryCard
          label="Sessions"
          planned={`${mockWeekData.planned.sessions}`}
          actual={`${mockWeekData.actual.sessions}`}
          percent={getCompletionPercent(mockWeekData.planned.sessions, mockWeekData.actual.sessions)}
        />
      </div>

      {/* Daily Breakdown */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr] bg-zinc-50 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="px-4 py-3">Day</div>
          <div className="px-4 py-3 border-l">Planned</div>
          <div className="px-4 py-3 border-l">Actual</div>
        </div>
        {mockWeekData.days.map((day, index) => (
          <div key={day.day} className={cn("grid grid-cols-[80px_1fr_1fr]", index !== mockWeekData.days.length - 1 && "border-b")}>
            <div className="px-4 py-4 font-medium text-sm">{day.day}</div>
            <div className="px-4 py-4 border-l">
              {day.planned.distance > 0 ? (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {day.planned.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{day.planned.distance} km</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Rest</span>
              )}
            </div>
            <div className="px-4 py-4 border-l">
              {day.actual ? (
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      day.actual.distance >= day.planned.distance ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {day.actual.type}
                  </Badge>
                  <span className="text-sm">{day.actual.distance} km</span>
                  <span className="text-xs text-muted-foreground">{formatDuration(day.actual.duration)}</span>
                  <span className="text-xs text-muted-foreground">{day.actual.avgHr} bpm</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <CreatePlannedWorkoutDialog
        open={openCreateWorkoutDialog}
        onOpenChange={() => setOpenCreateWorkoutDialog(false)}
        onSubmit={() => {}}
        weekStartDate={new Date()}
      />
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  planned: string;
  actual: string;
  percent: number;
}

function SummaryCard({ label, planned, actual, percent }: SummaryCardProps) {
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
