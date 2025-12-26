import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Textarea } from "@/lib/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import {
  activityTypes,
  type ActivityType,
  type RPE,
  type TrainingEffectLabel,
  type WorkoutType,
  workoutTypes,
  trainingEffectLabels,
} from "@/lib/types/type";
import type { CreateActivityParams } from "../../controllers/activity.controller";
import { formatWorkoutType } from "../../utils/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateActivityParams) => void;
  loading?: boolean;
}

const optionalFieldsInitial = [
  { value: "elevation", label: "Elevation Gain" },
  { value: "rpe", label: "RPE" },
  { value: "trainingEffect", label: "Training Effect" },
  { value: "avgTemperatureCelsius", label: "Avg Temperature" },
  { value: "calories", label: "Calories" },
  { value: "steps", label: "Steps" },
  { value: "avgCadence", label: "Avg Cadence" },
  { value: "isPr", label: "PR" },
  { value: "avgHeartRate", label: "Avg Heart Rate" },
  { value: "maxHeartRate", label: "Max Heart Rate" },
  { value: "notes", label: "Notes" },
];

export function CreateActivityDialog({ open, onOpenChange, onSubmit, loading }: CreateActivityDialogProps) {
  const [activityType, setActivityType] = useState<ActivityType>("run");
  const [workoutType, setWorkoutType] = useState<WorkoutType>("easy_run");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Always visible fields
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  // Optional fields
  const [selectedFields, setSelectedFields] = useState<{ value: string; label: string }[]>([]);
  const [optionalFields, setOptionalFields] = useState<{ value: string; label: string }[]>(optionalFieldsInitial);
  const [openOptions, setOpenOptions] = useState(false);
  const [elevation, setElevation] = useState("");
  const [rpe, setRpe] = useState<RPE | undefined>();
  const [trainingEffect, setTrainingEffect] = useState<TrainingEffectLabel | undefined>();
  const [notes, setNotes] = useState("");
  const [avgTemperatureCelsius, setAvgTemperatureCelsius] = useState<number | undefined>();
  const [calories, setCalories] = useState<number | undefined>();
  const [steps, setSteps] = useState<number | undefined>();
  const [avgCadence, setAvgCadence] = useState<number | undefined>();
  const [isPr, setIsPr] = useState<boolean | undefined>();
  const [avgHeartRate, setAvgHeartRate] = useState<number | undefined>();
  const [maxHeartRate, setMaxHeartRate] = useState<number | undefined>();

  const addField = (field: { value: string; label: string }) => {
    setSelectedFields((prev) => [...prev, field]);
    setOptionalFields((prev) => prev.filter((f) => f.value !== field.value));
  };

  const removeField = (field: { value: string; label: string }) => {
    setSelectedFields((prev) => prev.filter((f) => f !== field));
    setOptionalFields((prev) => [...prev, field]);
    switch (field.value) {
      case "elevation":
        setElevation("");
        break;
      case "rpe":
        setRpe(undefined);
        break;
      case "trainingEffect":
        setTrainingEffect(undefined);
        break;
      case "notes":
        setNotes("");
        break;
      case "avgTemperatureCelsius":
        setAvgTemperatureCelsius(undefined);
        break;
      case "calories":
        setCalories(undefined);
        break;
      case "steps":
        setSteps(undefined);
        break;
      case "avgCadence":
        setAvgCadence(undefined);
        break;
      case "isPr":
        setIsPr(undefined);
        break;
      case "avgHeartRate":
        setAvgHeartRate(undefined);
        break;
      case "maxHeartRate":
        setMaxHeartRate(undefined);
        break;
    }
  };

  const handleSubmit = () => {
    const durationSeconds = parseInt(hours || "0") * 3600 + parseInt(minutes || "0") * 60 + parseInt(seconds || "0");
    const fields = selectedFields.map((f) => f.value);

    onSubmit({
      resetForm,
      activityType,
      workoutType,
      startTime: new Date(startTime).toISOString(),
      ...(distance && { distanceMeters: parseFloat(distance) * 1000 }),
      ...(durationSeconds > 0 && { durationSeconds }),
      ...(fields.includes("elevation") && elevation && { elevationGainMeters: parseFloat(elevation) }),
      ...(fields.includes("rpe") && rpe && { rpe }),
      ...(fields.includes("trainingEffect") && trainingEffect && { trainingEffectLabel: trainingEffect }),
      ...(fields.includes("notes") && notes && { notes }),
      ...(fields.includes("avgTemperatureCelsius") && avgTemperatureCelsius && { avgTemperatureCelsius }),
      ...(fields.includes("calories") && calories && { calories }),
      ...(fields.includes("steps") && steps && { steps }),
      ...(fields.includes("avgCadence") && avgCadence && { avgCadence }),
      ...(fields.includes("isPr") && isPr && { isPr }),
      ...(fields.includes("avgHeartRate") && avgHeartRate && { avgHeartRate }),
      ...(fields.includes("maxHeartRate") && maxHeartRate && { maxHeartRate }),
    });
  };

  const resetForm = () => {
    setActivityType("run");
    setWorkoutType("easy_run");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setStartTime(now.toISOString().slice(0, 16));
    setDistance("");
    setHours("");
    setMinutes("");
    setSeconds("");
    setSelectedFields([]);
    setOptionalFields(optionalFieldsInitial);
    setElevation("");
    setRpe(undefined);
    setTrainingEffect(undefined);
    setNotes("");
    setAvgTemperatureCelsius(undefined);
    setCalories(undefined);
    setSteps(undefined);
    setAvgCadence(undefined);
    setIsPr(undefined);
    setAvgHeartRate(undefined);
    setMaxHeartRate(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg!">
        <DialogHeader>
          <DialogTitle>Create Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[600px]! scrollable overflow-y-auto!">
          {/* Activity & Workout Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Activity Type</Label>
              <Select value={activityType} onValueChange={(v) => setActivityType(v as ActivityType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1">
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatWorkoutType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Workout Type</Label>
              <Select value={workoutType} onValueChange={(v) => setWorkoutType(v as WorkoutType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workoutTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatWorkoutType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Distance</Label>
            <div className="flex items-center gap-2">
              <Input type="number" step="0.01" placeholder="0.00" value={distance} onChange={(e) => setDistance(e.target.value)} />
              <span className="text-sm text-muted-foreground w-8">km</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <div className="flex items-center gap-2">
              <Input type="number" min="0" placeholder="0" value={hours} onChange={(e) => setHours(e.target.value)} className="w-20" />
              <span className="text-xs text-muted-foreground">h</span>
              <Input type="number" min="0" max="59" placeholder="0" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-20" />
              <span className="text-xs text-muted-foreground">m</span>
              <Input type="number" min="0" max="59" placeholder="0" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="w-20" />
              <span className="text-xs text-muted-foreground">s</span>
            </div>
          </div>

          {/* Optional Fields */}
          {selectedFields.map((field) => (
            <div key={field.value} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>{field.label}</Label>
                <button type="button" onClick={() => removeField(field)} className="text-muted-foreground hover:text-foreground p-0.5">
                  <X className="size-3.5" />
                </button>
              </div>

              {field.value === "elevation" && (
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="0" value={elevation} onChange={(e) => setElevation(e.target.value)} />
                  <span className="text-sm text-muted-foreground w-8">m</span>
                </div>
              )}

              {field.value === "rpe" && (
                <Select value={rpe?.toString()} onValueChange={(v) => setRpe(parseInt(v) as RPE)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select RPE" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} - {["Very Easy", "Easy", "Moderate", "Hard", "Max Effort"][value - 1]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.value === "trainingEffect" && (
                <Select value={trainingEffect} onValueChange={(v) => setTrainingEffect(v as TrainingEffectLabel)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Training Effect" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingEffectLabels.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.value === "avgTemperatureCelsius" && (
                <Input
                  type="number"
                  placeholder="0"
                  value={avgTemperatureCelsius}
                  onChange={(e) => setAvgTemperatureCelsius(Number(e.target.value))}
                />
              )}

              {field.value === "calories" && (
                <Input type="number" placeholder="0" value={calories} onChange={(e) => setCalories(Number(e.target.value))} />
              )}

              {field.value === "steps" && <Input type="number" placeholder="0" value={steps} onChange={(e) => setSteps(Number(e.target.value))} />}

              {field.value === "avgCadence" && (
                <Input type="number" placeholder="0" value={avgCadence} onChange={(e) => setAvgCadence(Number(e.target.value))} />
              )}

              {field.value === "isPr" && (
                <Select value={isPr?.toString()} onValueChange={(v) => setIsPr(v === "true")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select PR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {field.value === "avgHeartRate" && (
                <Input type="number" placeholder="0" value={avgHeartRate} onChange={(e) => setAvgHeartRate(Number(e.target.value))} />
              )}

              {field.value === "maxHeartRate" && (
                <Input type="number" placeholder="0" value={maxHeartRate} onChange={(e) => setMaxHeartRate(Number(e.target.value))} />
              )}

              {field.value === "notes" && (
                <Textarea
                  placeholder="Add notes about your activity..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-20"
                />
              )}
            </div>
          ))}

          <Popover open={openOptions} onOpenChange={setOpenOptions}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full border-dashed text-muted-foreground">
                <Plus className="w-4 h-4 text-primary" />
                Add Field
              </Button>
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              {optionalFields.map((el, i) => (
                <div
                  key={i}
                  className="rounded-md py-1 pr-8 pl-1.5 text-sm hover:bg-accent cursor-pointer"
                  onClick={() => {
                    addField(el);
                    setOpenOptions(false);
                  }}
                >
                  {el.label}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            Create Activity
            {loading && <Loader2 className="size-4 animate-spin mr-1" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
