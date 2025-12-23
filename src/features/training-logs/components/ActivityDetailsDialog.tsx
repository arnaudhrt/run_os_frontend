import type React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import { Timer, TrendingUp, Heart, Zap, Thermometer, FileText, Activity, ArrowDown, Flame, Footprints, Trophy, Clock, Gauge } from "lucide-react";
import {
  formatDistance,
  formatDuration,
  formatElevation,
  formatAvgMaxHR,
  formatDate,
  formatWorkoutType,
  speedToPaceFormatted,
} from "../utils/format";
import type { ActivityModel } from "../models/activity.model";

interface ActivityDetailsDialogProps {
  activity: ActivityModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailsDialog({ activity, open, onOpenChange }: ActivityDetailsDialogProps) {
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
      <DialogContent className="max-w-2xl! max-h-[90vh]! overflow-y-auto! overflow-x-hidden! p-0">
        {/* Header Section */}
        <div className="bg-muted/30 p-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize bg-background">
                <Activity className="w-3 h-3 mr-1 text-primary" />
                {activity.activity_type.toLowerCase()}
              </Badge>
              {activity.is_pr && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  <Trophy className="w-3 h-3 mr-1" />
                  PR
                </Badge>
              )}
              <SourceBadge source={activity.source} />
            </div>
            <span className="text-sm text-muted-foreground">{formatDate(activity.start_time)}</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">{formatWorkoutType(activity.workout_type)}</DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Distance</p>
              <p className="text-2xl font-bold">{formatDistance(activity.distance_meters || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Time</p>
              <p className="text-2xl font-bold">{formatDuration(activity.duration_seconds || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Avg Pace</p>
              <p className="text-2xl font-bold">{activity.avg_speed_mps ? speedToPaceFormatted(activity.avg_speed_mps) : "-"}</p>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard
              icon={<Flame className="w-4 h-4 text-orange-500" />}
              label="Calories"
              value={activity.calories ? `${activity.calories}` : "-"}
            />
            <MetricCard
              icon={<Footprints className="w-4 h-4 text-blue-500" />}
              label="Steps"
              value={activity.steps ? activity.steps.toLocaleString() : "-"}
            />
            <MetricCard
              icon={<Clock className="w-4 h-4 text-purple-500" />}
              label="Elapsed"
              value={activity.elapsed_duration_seconds ? formatDuration(activity.elapsed_duration_seconds) : "-"}
            />
            <MetricCard
              icon={<Gauge className="w-4 h-4 text-green-500" />}
              label="Best Pace"
              value={activity.max_speed_mps ? speedToPaceFormatted(activity.max_speed_mps) ?? "-" : "-"}
            />
          </div>

          <Separator />

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> Performance
              </h4>
              <div className="space-y-3">
                <StatRow
                  label="Heart Rate"
                  value={formatAvgMaxHR(activity.avg_heart_rate, activity.max_heart_rate)}
                  icon={<Heart className="w-4 h-4" />}
                />
                <StatRow
                  label="Avg Pace"
                  value={activity.avg_speed_mps ? (speedToPaceFormatted(activity.avg_speed_mps) ?? "-") + " /km" : "-"}
                  icon={<Timer className="w-4 h-4" />}
                />
                <StatRow
                  label="Avg Cadence"
                  value={activity.avg_cadence ? `${activity.avg_cadence} spm` : "-"}
                  icon={<Activity className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Elevation & Environment */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Environment
              </h4>
              <div className="space-y-3">
                <StatRow
                  label="Elevation Gain"
                  value={formatElevation(activity.elevation_gain_meters || 0)}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <StatRow
                  label="Elevation Loss"
                  value={formatElevation(activity.elevation_loss_meters || 0)}
                  icon={<ArrowDown className="w-4 h-4" />}
                />
                <StatRow
                  label="Temperature"
                  value={activity.avg_temperature_celsius ? `${activity.avg_temperature_celsius}°C` : "-"}
                  icon={<Thermometer className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>

          {/* Training Effect Section */}
          {hasTrainingEffect && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> Training Effect
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <TrainingEffectCard label="Aerobic" value={activity.aerobic_training_effect} />
                  <TrainingEffectCard label="Anaerobic" value={activity.anaerobic_training_effect} />
                </div>
                {activity.training_effect_label && (
                  <Badge variant="outline" className="capitalize">
                    {activity.training_effect_label.toLowerCase().replace("_", " ")}
                  </Badge>
                )}
              </div>
            </>
          )}

          {/* Heart Rate Zones */}
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

          {/* User Feedback (RPE & Notes) */}
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

// Helper component for clean stat rows
function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

// Compact metric card for secondary stats
function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 text-center space-y-1">
      <div className="flex justify-center">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

// Source badge component
function SourceBadge({ source }: { source: string }) {
  const config = {
    garmin: { label: "Garmin", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    strava: { label: "Strava", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    manual: { label: "Manual", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  }[source] || { label: source, className: "" };

  return (
    <Badge variant="outline" className={`text-xs ${config.className}`}>
      {config.label}
    </Badge>
  );
}

// Training effect card with visual indicator
function TrainingEffectCard({ label, value }: { label: string; value?: number }) {
  if (value === undefined || value === null) return null;

  const numValue = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numValue)) return null;

  const getEffectColor = (val: number) => {
    if (val < 2) return "text-gray-400";
    if (val < 3) return "text-blue-400";
    if (val < 4) return "text-green-400";
    if (val < 5) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 text-center">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${getEffectColor(numValue)}`}>{numValue.toFixed(1)}</p>
    </div>
  );
}

// Heart rate zone bar
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
