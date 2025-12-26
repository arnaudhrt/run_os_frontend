import { Input } from "@/lib/ui/input";
import { Separator } from "@/lib/ui/separator";
import React, { useState } from "react";
import type { ActivityModel } from "../../models/activity.model";
import { TrendingUp, Zap, Thermometer, FileText, Activity, ArrowDown, Flame, Footprints, HeartPulse, HeartPlus, Loader2 } from "lucide-react";
import { Textarea } from "@/lib/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/lib/ui/native-select";
import { rpe as rpeOptions, activityTypes, workoutTypes, type ActivityType, type WorkoutType, type RPE } from "@/lib/types/type";
import { formatRpe, formatActivityType, formatWorkoutType } from "../../utils/format";
import { Button } from "@/lib/ui/button";
import type { UpdateActivityParams, ValidationErrors } from "../../controllers/activity.controller";

interface EditActivityFormProps {
  activity: ActivityModel;
  onSave: (params: Omit<UpdateActivityParams, "id" | "onClose">) => void;
  onCancel: () => void;
  loading?: boolean;
  validationErrors?: ValidationErrors;
}

// Helper to calculate pace (min/km) from distance (km) and duration (seconds)
function calculatePaceFromDistanceAndDuration(distanceKm: number, durationSeconds: number): { paceMin: number; paceSec: number } {
  if (distanceKm <= 0 || durationSeconds <= 0) return { paceMin: 0, paceSec: 0 };
  const paceSecondsPerKm = durationSeconds / distanceKm;
  const paceMin = Math.floor(paceSecondsPerKm / 60);
  const paceSec = Math.round(paceSecondsPerKm % 60);
  return { paceMin, paceSec };
}

// Helper to calculate duration (seconds) from distance (km) and pace (min:sec per km)
function calculateDurationFromDistanceAndPace(distanceKm: number, paceMin: number, paceSec: number): number {
  if (distanceKm <= 0) return 0;
  const paceSecondsPerKm = paceMin * 60 + paceSec;
  return Math.round(distanceKm * paceSecondsPerKm);
}

// Get initial pace from activity
function getInitialPace(activity: ActivityModel): { paceMin: number; paceSec: number } {
  if (activity.avg_speed_mps && activity.avg_speed_mps > 0) {
    const paceSecondsPerKm = 1000 / activity.avg_speed_mps;
    return {
      paceMin: Math.floor(paceSecondsPerKm / 60),
      paceSec: Math.round(paceSecondsPerKm % 60),
    };
  }
  return { paceMin: 0, paceSec: 0 };
}

export default function EditActivityForm({ activity, onSave, onCancel, loading, validationErrors }: EditActivityFormProps) {
  const [activityType, setActivityType] = useState<ActivityType>(activity.activity_type);
  const [workoutType, setWorkoutType] = useState<WorkoutType>(activity.workout_type);
  const [distance, setDistance] = useState(activity.distance_meters ? activity.distance_meters / 1000 : 0);
  const [distanceInput, setDistanceInput] = useState(activity.distance_meters ? (activity.distance_meters / 1000).toString() : "0");
  const [hours, setHours] = useState(activity.duration_seconds ? Math.floor(activity.duration_seconds / 3600) : 0);
  const [minutes, setMinutes] = useState(activity.duration_seconds ? Math.floor((activity.duration_seconds % 3600) / 60) : 0);
  const [seconds, setSeconds] = useState(activity.duration_seconds ? Math.floor(activity.duration_seconds % 60) : 0);
  const initialPace = getInitialPace(activity);
  const [paceMin, setPaceMin] = useState(initialPace.paceMin);
  const [paceSec, setPaceSec] = useState(initialPace.paceSec);
  const [elevationGain, setElevationGain] = useState(activity.elevation_gain_meters || 0);
  const [elevationLoss, setElevationLoss] = useState(activity.elevation_loss_meters || 0);
  const [avgHeartRate, setAvgHeartRate] = useState(activity.avg_heart_rate || 0);
  const [maxHeartRate, setMaxHeartRate] = useState(activity.max_heart_rate || 0);
  const [avgCadence, setAvgCadence] = useState(activity.avg_cadence || 0);
  const [steps, setSteps] = useState(activity.steps || 0);
  const [calories, setCalories] = useState(activity.calories || 0);
  const [avgTemperature, setAvgTemperature] = useState(activity.avg_temperature_celsius || 0);
  const [notes, setNotes] = useState(activity.notes || "");
  const [rpe, setRpe] = useState<RPE | 0>(activity.rpe || 0);

  // Handle distance change - update pace (keep duration fixed)
  const handleDistanceChange = (value: string) => {
    setDistanceInput(value);
    const numValue = parseFloat(value) || 0;
    setDistance(numValue);
    const durationSec = hours * 3600 + minutes * 60 + seconds;
    if (numValue > 0 && durationSec > 0) {
      const { paceMin: newPaceMin, paceSec: newPaceSec } = calculatePaceFromDistanceAndDuration(numValue, durationSec);
      setPaceMin(newPaceMin);
      setPaceSec(newPaceSec);
    }
  };

  // Handle duration change - update pace (keep distance fixed)
  const handleDurationChange = (h: number, m: number, s: number) => {
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    const durationSec = h * 3600 + m * 60 + s;
    if (distance > 0 && durationSec > 0) {
      const { paceMin: newPaceMin, paceSec: newPaceSec } = calculatePaceFromDistanceAndDuration(distance, durationSec);
      setPaceMin(newPaceMin);
      setPaceSec(newPaceSec);
    }
  };

  // Handle pace change - update duration (keep distance fixed)
  const handlePaceChange = (newPaceMin: number, newPaceSec: number) => {
    setPaceMin(newPaceMin);
    setPaceSec(newPaceSec);
    if (distance > 0 && (newPaceMin > 0 || newPaceSec > 0)) {
      const newDurationSec = calculateDurationFromDistanceAndPace(distance, newPaceMin, newPaceSec);
      const newHours = Math.floor(newDurationSec / 3600);
      const newMinutes = Math.floor((newDurationSec % 3600) / 60);
      const newSeconds = Math.round(newDurationSec % 60);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);
    }
  };

  // Helper to safely parse number, returns undefined for invalid/empty values
  const safeNumber = (val: number): number | undefined => {
    if (isNaN(val) || val === 0) return undefined;
    return val;
  };

  // Helper for temperature which can be negative or 0
  const safeTemperature = (val: number): number | undefined => {
    if (isNaN(val)) return undefined;
    return val !== 0 ? val : undefined;
  };

  const handleSubmit = () => {
    const durationSeconds = hours * 3600 + minutes * 60 + seconds;
    const distanceMeters = distance * 1000;

    onSave({
      activityType,
      workoutType,
      distanceMeters: safeNumber(distanceMeters),
      durationSeconds: safeNumber(durationSeconds),
      elevationGainMeters: safeNumber(elevationGain),
      elevationLossMeters: safeNumber(elevationLoss),
      avgHeartRate: safeNumber(avgHeartRate),
      maxHeartRate: safeNumber(maxHeartRate),
      avgCadence: safeNumber(avgCadence),
      steps: safeNumber(steps),
      calories: safeNumber(calories),
      avgTemperatureCelsius: safeTemperature(avgTemperature),
      rpe: rpe > 0 ? (rpe as RPE) : undefined,
      notes: notes || undefined,
    });
  };

  const showPace = activityType === "run" || activityType === "treadmill" || activityType === "trail" || activityType === "hike";

  return (
    <>
      <div className="flex gap-5 text-center mb-8">
        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-wider text-foreground font-medium">Activity Type</p>
          <NativeSelect className="w-full" value={activityType} onChange={(e) => setActivityType(e.target.value as ActivityType)}>
            {activityTypes.map((type) => (
              <NativeSelectOption key={type} value={type}>
                {formatActivityType(type)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError error={validationErrors?.activityType} />
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-wider text-foreground font-medium">Workout Type</p>
          <NativeSelect className="w-full" value={workoutType} onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}>
            {workoutTypes.map((type) => (
              <NativeSelectOption key={type} value={type}>
                {formatWorkoutType(type)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError error={validationErrors?.workoutType} />
        </div>
      </div>

      <div className="flex gap-5 text-center mb-8">
        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-wider text-foreground font-medium">Distance (km)</p>
          <Input type="text" inputMode="decimal" value={distanceInput} onChange={(e) => handleDistanceChange(e.target.value)} />
          <FieldError error={validationErrors?.distanceMeters} />
        </div>

        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-wider text-foreground font-medium">Duration</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={hours}
              onChange={(e) => handleDurationChange(Number(e.target.value), minutes, seconds)}
              className="w-14"
            />
            <span className="text-xs text-muted-foreground">h</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={minutes}
              onChange={(e) => handleDurationChange(hours, Number(e.target.value), seconds)}
              className="w-14"
            />
            <span className="text-xs text-muted-foreground">m</span>
            <Input
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={seconds}
              onChange={(e) => handleDurationChange(hours, minutes, Number(e.target.value))}
              className="w-14"
            />
            <span className="text-xs text-muted-foreground">s</span>
          </div>
          <FieldError error={validationErrors?.durationSeconds} />
        </div>

        {showPace && (
          <div className="space-y-1 flex-1">
            <p className="text-xs uppercase tracking-wider text-foreground font-medium">Avg Pace (/km)</p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={paceMin}
                onChange={(e) => handlePaceChange(Number(e.target.value), paceSec)}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={paceSec}
                onChange={(e) => handlePaceChange(paceMin, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex gap-8">
        <div className="space-y-4 flex-1">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" /> Performance
          </h4>
          <div className="space-y-3">
            <StatRow label="Avg Heart Rate (bpm)" icon={<HeartPulse className="w-4 h-4" />} error={validationErrors?.avgHeartRate}>
              <Input
                className="text-right h-7"
                type="number"
                value={avgHeartRate || ""}
                onChange={(e) => setAvgHeartRate(Number(e.target.value) || 0)}
              />
            </StatRow>
            <StatRow label="Max Heart Rate (bpm)" icon={<HeartPlus className="w-4 h-4" />} error={validationErrors?.maxHeartRate}>
              <Input
                className="text-right h-7"
                type="number"
                value={maxHeartRate || ""}
                onChange={(e) => setMaxHeartRate(Number(e.target.value) || 0)}
              />
            </StatRow>
            <StatRow label="Avg Cadence (spm)" icon={<Activity className="w-4 h-4" />} error={validationErrors?.avgCadence}>
              <Input className="text-right h-7" type="number" value={avgCadence || ""} onChange={(e) => setAvgCadence(Number(e.target.value) || 0)} />
            </StatRow>
            <StatRow label="Steps" icon={<Footprints className="w-4 h-4" />} error={validationErrors?.steps}>
              <Input className="text-right h-7" type="number" value={steps || ""} onChange={(e) => setSteps(Number(e.target.value) || 0)} />
            </StatRow>
            <StatRow label="Calories" icon={<Flame className="w-4 h-4" />} error={validationErrors?.calories}>
              <Input className="text-right h-7" type="number" value={calories || ""} onChange={(e) => setCalories(Number(e.target.value) || 0)} />
            </StatRow>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Environment
            </h4>
            <div className="space-y-3">
              <StatRow label="Elevation Gain (m)" icon={<TrendingUp className="w-4 h-4" />} error={validationErrors?.elevationGainMeters}>
                <Input
                  className="text-right h-7"
                  type="number"
                  value={elevationGain || ""}
                  onChange={(e) => setElevationGain(Number(e.target.value) || 0)}
                />
              </StatRow>
              <StatRow label="Elevation Loss (m)" icon={<ArrowDown className="w-4 h-4" />} error={validationErrors?.elevationLossMeters}>
                <Input
                  className="text-right h-7"
                  type="number"
                  value={elevationLoss || ""}
                  onChange={(e) => setElevationLoss(Number(e.target.value) || 0)}
                />
              </StatRow>
              <StatRow label="Avg Temperature (°C)" icon={<Thermometer className="w-4 h-4" />} error={validationErrors?.avgTemperatureCelsius}>
                <Input
                  className="text-right h-7"
                  type="number"
                  value={avgTemperature || ""}
                  onChange={(e) => setAvgTemperature(Number(e.target.value) || 0)}
                />
              </StatRow>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" /> Post-Run Notes
          </h4>
          <div className="flex gap-2 items-center">
            <p>Rpe (1-5):</p>
            <NativeSelect size="sm" value={rpe} onChange={(e) => setRpe(Number(e.target.value) as RPE | 0)}>
              <NativeSelectOption value={0}>-</NativeSelectOption>
              {rpeOptions.map((el, i) => (
                <NativeSelectOption key={i} value={el}>
                  {formatRpe(el)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>
        <Textarea placeholder="Add notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Save Changes
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </>
  );
}

function StatRow({ label, children, icon, error }: { label: string; children: React.ReactNode; icon: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
          {icon}
          <span className="capitalize">{label}</span>
        </div>
        <div className="max-w-[120px]">{children}</div>
      </div>
      {error && <p className="text-xs text-red-500 text-right">{error}</p>}
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-xs text-red-500 mt-1">{error}</p>;
}
