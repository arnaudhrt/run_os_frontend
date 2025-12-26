import type React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import {
  TrendingUp,
  Heart,
  Zap,
  Thermometer,
  FileText,
  Activity,
  Flame,
  Footprints,
  Trophy,
  Clock,
  HeartPulse,
  HeartPlus,
  Blocks,
  Edit,
  Trash,
} from "lucide-react";
import { formatDuration, formatWorkoutType, formatHeartRate, formatDistance } from "../utils/format";
import type { ActivityModel } from "../models/activity.model";
import { ActivityBadge } from "./ActivityBadge";
import { format } from "date-fns";
import { Button } from "@/lib/ui/button";
import type { LoadingState } from "../controllers/activity.controller";
import DeleteDialog from "./DeleteDialog";

interface OtherActivityDetailsDialogProps {
  activity: ActivityModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: LoadingState;
  deleteActivity: (activityId: string, onClose: () => void) => Promise<void>;
}

export function OtherActivityDetailsDialog({ activity, open, deleteActivity, onOpenChange }: OtherActivityDetailsDialogProps) {
  if (!activity) return null;

  const hasHRZones =
    activity.time_in_zone_1 || activity.time_in_zone_2 || activity.time_in_zone_3 || activity.time_in_zone_4 || activity.time_in_zone_5;
  const totalZoneTime =
    (activity.time_in_zone_1 || 0) +
    (activity.time_in_zone_2 || 0) +
    (activity.time_in_zone_3 || 0) +
    (activity.time_in_zone_4 || 0) +
    (activity.time_in_zone_5 || 0);

  const hasTrainingEffect = activity.aerobic_training_effect || activity.anaerobic_training_effect;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! max-h-[90vh]! overflow-x-hidden! p-0">
        <div className="bg-muted/30 p-6 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <ActivityBadge type={activity.activity_type} />
            {activity.is_pr && (
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-300">
                <Trophy className="w-3 h-3 mr-1" />
                PR
              </Badge>
            )}
            <SourceBadge source={activity.source} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {format(new Date(activity.start_time), "EEEE, MMMM do")} - {formatWorkoutType(activity.workout_type)}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 text-primary" />
              </Button>
              <DeleteDialog onDelete={() => deleteActivity(activity.id, () => onOpenChange(false))}>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 text-red-700" />
                </Button>
              </DeleteDialog>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6 max-h-[600px]! overflow-y-auto! ">
          <div className="flex gap-4 text-center mb-8">
            {(activity.activity_type === "bike" || activity.activity_type === "swim") && (
              <div className="space-y-1 flex-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Distance</p>
                <p className="text-2xl font-bold font-mono tracking-wider">{formatDistance(activity.distance_meters || 0)}</p>
              </div>
            )}
            <div className="space-y-1 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Time</p>
              <p className="text-2xl font-bold font-mono tracking-wider">{formatDuration(activity.duration_seconds || 0)}</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-8">
            <div className="space-y-4 flex-1">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Performance
              </h4>
              <div className="space-y-3">
                <StatRow
                  label="Elapsed"
                  value={activity.elapsed_duration_seconds ? formatDuration(activity.elapsed_duration_seconds) : "-"}
                  icon={<Clock className="w-4 h-4" />}
                />
                <StatRow label="Avg Heart Rate" value={formatHeartRate(activity.avg_heart_rate)} icon={<HeartPulse className="w-4 h-4" />} />
                <StatRow label="Max Heart Rate" value={formatHeartRate(activity.max_heart_rate)} icon={<HeartPlus className="w-4 h-4" />} />
                <StatRow label="Steps" value={activity.steps?.toString() || "N/A"} icon={<Footprints className="w-4 h-4" />} />
                <StatRow label="Calories" value={activity.calories ? `${activity.calories}` : "-"} icon={<Flame className="w-4 h-4" />} />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> Environment
                </h4>
                <div className="space-y-3">
                  <StatRow
                    label="Avg Temperature"
                    value={activity.avg_temperature_celsius ? `${activity.avg_temperature_celsius}°C` : "-"}
                    icon={<Thermometer className="w-4 h-4" />}
                  />
                </div>
              </div>
              {hasTrainingEffect && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" /> Training Effect
                  </h4>
                  <div className="space-y-3">
                    <StatRow
                      label="Primary Effect"
                      value={activity?.training_effect_label ? activity?.training_effect_label.toLowerCase().replace("_", " ") : "-"}
                      icon={<Activity className="w-4 h-4" />}
                    />
                    <StatRow
                      label="Aerobic"
                      value={activity?.aerobic_training_effect ? activity.aerobic_training_effect.toString() : "0"}
                      icon={<Blocks className="w-4 h-4" />}
                    />

                    <StatRow
                      label="Anaerobic"
                      value={activity?.anaerobic_training_effect ? activity.anaerobic_training_effect.toString() : "0"}
                      icon={<Blocks className="w-4 h-4" />}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasHRZones && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Heart Rate Zones
                </h4>
                <div className="space-y-2">
                  <ZoneBar zone={1} time={activity.time_in_zone_1 || 0} total={totalZoneTime} color="bg-gray-400" />
                  <ZoneBar zone={2} time={activity.time_in_zone_2 || 0} total={totalZoneTime} color="bg-blue-500" />
                  <ZoneBar zone={3} time={activity.time_in_zone_3 || 0} total={totalZoneTime} color="bg-green-500" />
                  <ZoneBar zone={4} time={activity.time_in_zone_4 || 0} total={totalZoneTime} color="bg-orange-500" />
                  <ZoneBar zone={5} time={activity.time_in_zone_5 || 0} total={totalZoneTime} color="bg-red-500" />
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" /> Post-Run Notes
              </h4>
              {activity.rpe && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase font-medium">RPE</span>
                  <Badge variant="secondary" className="font-bold">
                    {activity.rpe} / 5
                  </Badge>
                </div>
              )}
            </div>
            <div className="bg-muted/20 rounded-lg p-4 italic text-sm text-muted-foreground min-h-16">
              {activity.notes || "No notes provided for this activity."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="capitalize">{label}</span>
      </div>
      <span className="text-black/80 capitalize font-mono font-semibold">{value}</span>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const config = {
    garmin: { label: "Garmin", className: "text-blue-500 border-blue-200" },
    strava: { label: "Strava", className: "text-orange-500 border-orange-200" },
    manual: { label: "Manual", className: "text-gray-500 border-gray-200" },
  }[source] || { label: source, className: "" };

  return (
    <Badge variant="outline" className={`text-xs uppercase ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function ZoneBar({ zone, time, total, color }: { zone: number; time: number; total: number; color: string }) {
  const percentage = total > 0 ? (time / total) * 100 : 0;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 text-muted-foreground">Z{zone}</span>
      <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-16 text-right text-muted-foreground text-xs">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
      <span className="w-10 text-right text-xs font-medium">{percentage.toFixed(0)}%</span>
    </div>
  );
}
