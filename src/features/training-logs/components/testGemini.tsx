import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Progress } from "@/lib/ui/progress"; // Assuming you have a progress component
import { Timer, TrendingUp, Heart, Zap, Thermometer, FileText, Activity, ArrowDown, Trophy, Dna, BarChart3 } from "lucide-react";
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

export function ActivityDialog({ activity, open, onOpenChange }: ActivityDetailsDialogProps) {
  if (!activity) return null;

  const zones = [
    { label: "Z1", value: activity.time_in_zone_1 || 0, color: "bg-gray-400" },
    { label: "Z2", value: activity.time_in_zone_2 || 0, color: "bg-blue-500" },
    { label: "Z3", value: activity.time_in_zone_3 || 0, color: "bg-green-500" },
    { label: "Z4", value: activity.time_in_zone_4 || 0, color: "bg-orange-500" },
    { label: "Z5", value: activity.time_in_zone_5 || 0, color: "bg-red-500" },
  ];

  const totalZoneTime = zones.reduce((acc, z) => acc + z.value, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! overflow-hidden p-0 gap-0">
        {/* Header Section */}
        <div className="bg-muted/30 p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize bg-background font-semibold">
                <Activity className="w-3 h-3 mr-1.5 text-primary" />
                {activity.activity_type.toLowerCase()}
              </Badge>
              {activity.is_pr && (
                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/10">
                  <Trophy className="w-3 h-3 mr-1.5" />
                  Personal Record
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-muted-foreground">{formatDate(activity.start_time)}</span>
          </div>
          <DialogTitle className="text-3xl font-bold tracking-tight">{formatWorkoutType(activity.workout_type)}</DialogTitle>
        </div>

        <div className="overflow-y-auto max-h-[80vh]">
          {/* Main Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-background">
            <MetricBlock label="Distance" value={formatDistance(activity.distance_meters || 0)} />
            <MetricBlock label="Time" value={formatDuration(activity.duration_seconds || 0)} />
            <MetricBlock label="Avg Pace" value={activity.avg_speed_mps ? speedToPaceFormatted(activity.avg_speed_mps) ?? "--" : "--"} />
            <MetricBlock label="Calories" value={activity.calories?.toLocaleString() ?? "--"} unit="kcal" />
          </div>

          <div className="px-6 pb-8 space-y-8">
            {/* Training Load Section */}
            {(activity.aerobic_training_effect || activity.training_effect_label) && (
              <section className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <Dna className="w-4 h-4" /> Training Impact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Aerobic TE</span>
                      <span className="font-bold">{activity.aerobic_training_effect || "0.0"}</span>
                    </div>
                    <Progress value={(activity.aerobic_training_effect || 0) * 20} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Anaerobic TE</span>
                      <span className="font-bold">{activity.anaerobic_training_effect || "0.0"}</span>
                    </div>
                    <Progress value={(activity.anaerobic_training_effect || 0) * 20} className="h-1.5" />
                  </div>
                </div>
                {activity.training_effect_label && (
                  <p className="mt-3 text-sm font-medium text-primary/80 italic">Focus: {activity.training_effect_label.replace(/_/g, " ")}</p>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Heart Rate Zones */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-500" /> Heart Rate Zones
                </h4>
                <div className="space-y-3">
                  {zones.map((zone) => (
                    <div key={zone.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{zone.label}</span>
                        <span className="text-muted-foreground">{formatDuration(zone.value)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${zone.color}`} style={{ width: `${totalZoneTime > 0 ? (zone.value / totalZoneTime) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" /> Performance
                  </h4>
                  <div className="space-y-2">
                    <StatRow
                      label="Heart Rate"
                      value={formatAvgMaxHR(activity.avg_heart_rate, activity.max_heart_rate)}
                      icon={<Heart className="w-4 h-4" />}
                    />
                    <StatRow
                      label="Max Speed"
                      value={activity.max_speed_mps ? speedToPaceFormatted(activity.max_speed_mps) ?? "--" : "--"}
                      icon={<Timer className="w-4 h-4" />}
                    />
                    <StatRow
                      label="Avg Cadence"
                      value={activity.avg_cadence ? `${activity.avg_cadence} spm` : "--"}
                      icon={<Activity className="w-4 h-4" />}
                    />
                    <StatRow label="Total Steps" value={activity.steps?.toLocaleString() || "--"} icon={<Zap className="w-4 h-4" />} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> Environment
                  </h4>
                  <div className="space-y-2">
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
                      value={activity.avg_temperature_celsius ? `${activity.avg_temperature_celsius}°C` : "--"}
                      icon={<Thermometer className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" /> Athlete Notes
                </h4>
                {activity.rpe && (
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 border-none font-bold">
                    RPE {activity.rpe} / 10
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic bg-muted/30 p-4 rounded-lg border border-dashed">
                {activity.notes || "No notes recorded for this session."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricBlock({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tabular-nums tracking-tight">{value}</span>
        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-muted/50 last:border-0">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <span className="opacity-70">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
