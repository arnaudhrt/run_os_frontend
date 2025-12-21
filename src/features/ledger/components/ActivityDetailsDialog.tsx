import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import { Timer, TrendingUp, Heart, Zap, Thermometer, FileText, Activity, ArrowDown } from "lucide-react";
import { formatDistance, formatDuration, formatPace, formatElevation, formatAvgMaxHR, formatDate, formatWorkoutType } from "../utils/format"; // Adjust path as needed
import type { ActivityModel } from "../models/activity.model";

interface ActivityDetailsDialogProps {
  activity: ActivityModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailsDialog({ activity, open, onOpenChange }: ActivityDetailsDialogProps) {
  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Header Section */}
        <div className="bg-muted/30 p-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="capitalize bg-background">
              <Activity className="w-3 h-3 mr-1 text-primary" />
              {activity.activity_type.toLowerCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatDate(activity.start_time)}</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">{formatWorkoutType(activity.workout_type)}</DialogTitle>
        </div>

        <div className="p-6 space-y-8">
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
              <p className="text-2xl font-bold">{formatPace(activity.avg_pace_min_per_km)}</p>
            </div>
          </div>

          <Separator />

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <StatRow label="Best Pace" value={formatPace(activity.best_pace_min_per_km)} icon={<Timer className="w-4 h-4" />} />
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
                    {activity.rpe} / 10
                  </Badge>
                </div>
              )}
            </div>
            <div className="bg-muted/20 rounded-lg p-4 italic text-sm text-muted-foreground min-h-20">
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
