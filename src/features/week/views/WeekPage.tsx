import { useState, useEffect, useMemo } from "react";
import { Download, Plus, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { cn } from "@/lib/utils";
import { CreatePlannedWorkoutDialog } from "../components/CreatePlannedWorkoutDialog";
import { WeekSelector } from "../components/WeekSelector";
import { WeekHeader } from "../components/WeekHeader";
import SummaryCard from "../components/SummaryCard";
import { getWeekDateRange, getWeekDays, formatActivityType, formatWorkoutType } from "../utils/planned-workout.utils";
import { usePlannedWorkoutController } from "../controllers/planned-workout.controller";
import type { CreatePlannedWorkoutModel, PlannedWorkoutModel } from "../models/planned-workout.model";

export default function WeekPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [openCreateWorkoutDialog, setOpenCreateWorkoutDialog] = useState(false);

  // Calculate week date range based on offset
  const weekRange = useMemo(() => getWeekDateRange(weekOffset), [weekOffset]);
  const weekDays = useMemo(() => getWeekDays(weekRange.start), [weekRange.start]);

  // Initialize controller with current week's date range
  const { plannedWorkouts, loading, handleFetchByDateRange, handleCreate } = usePlannedWorkoutController(weekRange.startStr, weekRange.endStr);

  // Fetch workouts when week changes
  useEffect(() => {
    handleFetchByDateRange();
  }, [weekRange.startStr, weekRange.endStr]);

  // Group workouts by date for easy lookup
  const workoutsByDate = useMemo(() => {
    const map = new Map<string, PlannedWorkoutModel[]>();
    for (const workout of plannedWorkouts) {
      const existing = map.get(workout.planned_date) || [];
      existing.push(workout);
      map.set(workout.planned_date, existing);
    }
    return map;
  }, [plannedWorkouts]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    let totalPlannedDistance = 0;
    const totalSessions = plannedWorkouts.length;

    for (const workout of plannedWorkouts) {
      if (workout.target_distance_meters) {
        totalPlannedDistance += workout.target_distance_meters / 1000; // Convert to km
      }
    }

    return {
      plannedVolume: Math.round(totalPlannedDistance * 10) / 10,
      plannedSessions: totalSessions,
    };
  }, [plannedWorkouts]);

  const handleCreateWorkout = (data: CreatePlannedWorkoutModel) => {
    handleCreate({
      plannedDate: data.planned_date,
      timeSlot: data.time_slot,
      activityType: data.activity_type,
      workoutType: data.workout_type,
      targetDistanceMeters: data.target_distance_meters,
      targetDurationSeconds: data.target_duration_seconds,
      description: data.description,
      activityId: data.activity_id,
      onClose: () => setOpenCreateWorkoutDialog(false),
    });
  };

  // TODO: Replace with actual training cycles from API
  const mockTrainingCycles: Parameters<typeof WeekHeader>[0]["trainingCycles"] = [];

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <header className="mb-10">
        <WeekHeader trainingCycles={mockTrainingCycles} />
      </header>

      <div className="flex items-center justify-between mb-8">
        <WeekSelector weekOffset={weekOffset} onWeekChange={setWeekOffset} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleFetchByDateRange()} disabled={loading.getByDateRange}>
            {loading.getByDateRange ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <RefreshCw className="size-4 mr-1.5" />}
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
        <SummaryCard label="Volume" planned={`${summaryStats.plannedVolume} km`} actual="— km" percent={0} />
        <SummaryCard label="Elevation" planned="— m" actual="— m" percent={0} />
        <SummaryCard label="Sessions" planned={`${summaryStats.plannedSessions}`} actual="—" percent={0} />
      </div>

      {/* Daily Breakdown */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr] bg-zinc-50 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="px-4 py-3">Day</div>
          <div className="px-4 py-3 border-l">Planned</div>
          <div className="px-4 py-3 border-l">Actual</div>
        </div>
        {loading.getByDateRange ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          weekDays.map((day, index) => {
            const dayWorkouts = workoutsByDate.get(day.date) || [];
            return (
              <div key={day.date} className={cn("grid grid-cols-[80px_1fr_1fr]", index !== weekDays.length - 1 && "border-b")}>
                <div className="px-4 py-4 font-medium text-sm">
                  <div>{day.dayShort}</div>
                  <div className="text-xs text-muted-foreground">{day.dayNum}</div>
                </div>
                <div className="px-4 py-4 border-l">
                  {dayWorkouts.length > 0 ? (
                    <div className="space-y-2">
                      {dayWorkouts.map((workout) => (
                        <div key={workout.id} className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {formatActivityType(workout.activity_type)}
                          </Badge>
                          {workout.workout_type && (
                            <Badge variant="secondary" className="text-xs">
                              {formatWorkoutType(workout.workout_type)}
                            </Badge>
                          )}
                          {workout.target_distance_meters && (
                            <span className="text-sm text-muted-foreground">{(workout.target_distance_meters / 1000).toFixed(1)} km</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
                <div className="px-4 py-4 border-l">
                  <span className="text-sm text-muted-foreground">—</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <CreatePlannedWorkoutDialog
        open={openCreateWorkoutDialog}
        onOpenChange={setOpenCreateWorkoutDialog}
        onSubmit={handleCreateWorkout}
        loading={loading.create}
        weekStartDate={weekRange.start}
      />
    </div>
  );
}
