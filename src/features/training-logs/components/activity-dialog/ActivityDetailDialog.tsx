import { Calendar, Timer, TrendingUp, Heart, Thermometer, FileText, Trophy, Trash, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import { Button } from "@/lib/ui/button";
import { format } from "date-fns";
import type { ActivityModel } from "../../models/activity.model";
import { formatDistance, formatDuration, formatWorkoutType, formatActivityType, renderPace, formatRpe, formatPace } from "../../utils/format";
import DeleteDialog from "./DeleteActivityDialog";
import { ActivityBadge } from "../data-table/ActivityBadge";

interface ActivityDetailDialogProps {
  activity: ActivityModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedActivity: (activity: ActivityModel | null) => void;
  deleteActivity: (activityId: string, onClose: () => void) => Promise<void>;
}

export function ActivityDetailDialog({ activity, open, onOpenChange, setSelectedActivity, deleteActivity }: ActivityDetailDialogProps) {
  if (!activity) return null;

  const sourceColors = {
    garmin: "text-blue-700 border-blue-300",
    strava: "text-orange-700 border-orange-300",
    manual: "text-zinc-600 border-zinc-300",
  };

  const isTrailOrHike = activity.activity_type === "trail" || activity.activity_type === "hike";
  const isRunning = activity.activity_type === "run" || activity.activity_type === "treadmill";
  const hasHeartRate = activity.avg_heart_rate || activity.max_heart_rate;
  const hasNotes = activity.notes || activity.rpe || activity.has_pain;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        setSelectedActivity(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <ActivityBadge type={activity.activity_type} />
            {activity.workout_type && <Badge variant="outline">{formatWorkoutType(activity.workout_type)}</Badge>}

            <Badge variant="outline" className={sourceColors[activity.source] || sourceColors.manual}>
              {activity.source.charAt(0).toUpperCase() + activity.source.slice(1)}
            </Badge>
            {activity.is_pr && (
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Trophy className="w-3 h-3 mr-1" />
                PR
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">{format(new Date(activity.start_time), "EEEE, MMMM do")}</DialogTitle>
          <div className="flex items-center text-zinc-500 text-sm gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(activity.start_time), "h:mm a")}
            </div>
          </div>
        </DialogHeader>

        {/* Main Stats */}
        <div className={`grid grid-cols-3 gap-4 mt-4`}>
          <div className="space-y-1 justify-self-center">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold text-center">Distance</p>
            <div className="font-mono font-medium text-lg text-center">{formatDistance(activity.distance_meters || 0)}</div>
          </div>
          <div className="space-y-1 justify-self-center">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold text-center">Duration</p>
            <div className="font-mono font-medium text-lg text-center">{formatDuration(activity.duration_seconds || 0)}</div>
          </div>
          {isRunning && (
            <div className="space-y-1 justify-self-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold text-center">Pace (min/km)</p>
              <div className="font-mono font-medium text-lg text-center">{renderPace(activity.distance_meters, activity.duration_seconds)}</div>
            </div>
          )}
          {isTrailOrHike && (
            <div className="space-y-1 justify-self-center">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold text-center">Elevation</span>
              <div className="flex items-center gap-1 font-mono font-medium text-lg">
                <TrendingUp className="w-4 h-4 text-zinc-400" />
                {activity.elevation_gain_meters || 0} <span className="text-xs">m</span>
              </div>
            </div>
          )}
        </div>

        {/* Pace (for running activities) */}
        {isRunning && activity.distance_meters && activity.duration_seconds && (
          <>
            <Separator className="my-3" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                <Timer className="w-3 h-3" /> Pace
              </span>
              <div className="font-mono font-medium text-lg">{renderPace(activity.distance_meters, activity.duration_seconds)}</div>
            </div>
          </>
        )}

        {/* Heart Rate & Temperature */}
        {(hasHeartRate || activity.avg_temperature_celsius) && (
          <>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-4">
              {hasHeartRate && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" /> Heart Rate
                  </span>
                  <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 space-y-1">
                    {activity.avg_heart_rate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-700/70">Avg</span>
                        <span className="font-mono font-semibold">{activity.avg_heart_rate} bpm</span>
                      </div>
                    )}
                    {activity.max_heart_rate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-700/70">Max</span>
                        <span className="font-mono font-semibold">{activity.max_heart_rate} bpm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activity.avg_temperature_celsius !== undefined && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-400" /> Temperature
                  </span>
                  <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-700/70">Avg</span>
                      <span className="font-mono font-semibold">{activity.avg_temperature_celsius}°C</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Notes Section */}
        {hasNotes && (
          <>
            <Separator className="my-3" />
            <section className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                <FileText className="w-3 h-3" /> Notes
              </h4>

              <div className="space-y-2">
                {activity.rpe && (
                  <div className="flex items-center justify-between bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
                    <span className="text-sm text-zinc-600">Effort (RPE)</span>
                    <Badge variant="secondary" className="font-mono font-semibold">
                      {formatRpe(activity.rpe)}
                    </Badge>
                  </div>
                )}

                {activity.has_pain && (
                  <div className="flex items-center justify-between bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    <span className="text-sm text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Pain/Discomfort
                    </span>
                    <span className="font-medium text-amber-800 capitalize">{activity.has_pain}</span>
                  </div>
                )}

                {activity.notes && <p className="text-sm text-zinc-600 leading-relaxed italic border-l-2 border-zinc-200 pl-3">"{activity.notes}"</p>}
              </div>
            </section>
          </>
        )}

        {/* Delete Button */}
        <Separator className="my-3" />
        <div className="flex justify-end">
          <DeleteDialog onDelete={() => deleteActivity(activity.id, () => onOpenChange(false))}>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash className="w-4 h-4 mr-1" />
              Delete Activity
            </Button>
          </DeleteDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
