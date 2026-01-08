import { Dialog, DialogContent } from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { activityTypes, workoutTypes } from "@/lib/types/type";
import { cn } from "@/lib/utils";
import { useCreatePlannedWorkoutStore } from "../stores/create-planned-workout.store";
import { formatActivityType, formatWorkoutType, timeSlotOptions, parseDurationToSeconds, getWeekDays } from "../utils/planned-workout.utils";
import type { CreatePlannedWorkoutModel } from "../models/planned-workout.model";
import { useEffect, useMemo } from "react";

interface CreatePlannedWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePlannedWorkoutModel) => void;
  loading?: boolean;
  /** If provided, skip the day selection step */
  initialDate?: string;
  /** Reference date to determine the current week (defaults to today) */
  weekStartDate: Date;
}

export function CreatePlannedWorkoutDialog({ open, onOpenChange, onSubmit, loading, initialDate, weekStartDate }: CreatePlannedWorkoutDialogProps) {
  const {
    step,
    direction,
    plannedDate,
    timeSlot,
    activityType,
    workoutType,
    targetDistance,
    targetDuration,
    description,
    setPlannedDate,
    setTimeSlot,
    setActivityType,
    setWorkoutType,
    setTargetDistance,
    setTargetDuration,
    setDescription,
    setStep,
    goNext,
    goBack,
    reset,
  } = useCreatePlannedWorkoutStore();

  // Calculate the week days based on weekStartDate
  const weekDays = useMemo(() => getWeekDays(weekStartDate), [weekStartDate]);

  // Skip step 0 if initialDate is provided
  const skipDaySelection = !!initialDate;
  const totalSteps = skipDaySelection ? 4 : 5;

  // Map actual step to display step (accounting for skipped step)
  const getDisplayStep = () => (skipDaySelection ? step : step);
  const displayStep = getDisplayStep();

  useEffect(() => {
    if (open && initialDate) {
      setPlannedDate(initialDate);
      setStep(1); // Start at activity type step
    }
  }, [open, initialDate, setPlannedDate, setStep]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  const handleSubmit = () => {
    const distanceMeters = targetDistance ? parseFloat(targetDistance) * 1000 : null;
    const durationSeconds = parseDurationToSeconds(targetDuration);

    onSubmit({
      planned_date: plannedDate,
      time_slot: timeSlot,
      activity_type: activityType,
      workout_type: workoutType,
      target_distance_meters: distanceMeters,
      target_duration_seconds: durationSeconds,
      description: description || null,
      activity_id: null,
    });
  };

  const handleActivityTypeSelect = (type: (typeof activityTypes)[number]) => {
    setActivityType(type);
    // If rest day, submit directly
    if (type === "rest_day") {
      onSubmit({
        planned_date: plannedDate,
        time_slot: "single",
        activity_type: "rest_day",
        workout_type: "other",
        target_distance_meters: null,
        target_duration_seconds: null,
        description: null,
        activity_id: null,
      });
    }
  };

  const handleNext = () => {
    if (step < 4) {
      goNext();
    } else {
      handleSubmit();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return plannedDate.length > 0;
      case 1:
        return activityType !== undefined && activityType !== "rest_day";
      case 2:
        return workoutType !== undefined;
      case 3:
        return timeSlot !== undefined;
      case 4:
        return true; // Details are optional
      default:
        return false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed()) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md! p-0! overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${(displayStep / totalSteps) * 100}%` }} />
        </div>

        <div className="p-6 min-h-[320px] flex flex-col">
          {/* Step indicator */}
          <div className="text-xs text-muted-foreground mb-6">
            Step {displayStep} of {totalSteps}
          </div>

          {/* Content area with transitions */}
          <div className="flex-1 flex flex-col">
            <div
              key={step}
              className={cn(
                "flex-1 flex flex-col animate-in duration-200",
                direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4",
                "fade-in"
              )}
            >
              {/* Step 0: Day Selection */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Which day?</h2>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setPlannedDate(day.date)}
                        className={cn(
                          "flex flex-col items-center p-2 rounded-lg border transition-all",
                          plannedDate === day.date ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-xs text-muted-foreground">{day.dayShort}</span>
                        <span className="text-lg font-medium">{day.dayNum}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Activity Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">What type of activity?</h2>
                  <div className="flex flex-wrap gap-2">
                    {activityTypes.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={cn(activityType === type && "bg-muted/50 ring-2 ring-primary ring-offset-1")}
                        onClick={() => handleActivityTypeSelect(type)}
                      >
                        {formatActivityType(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Workout Type */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">What kind of workout?</h2>
                  <div className="flex flex-wrap gap-2">
                    {workoutTypes.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={cn(workoutType === type && "bg-muted/50 ring-2 ring-primary ring-offset-1")}
                        onClick={() => setWorkoutType(type)}
                      >
                        {formatWorkoutType(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Time Slot */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">When during the day?</h2>
                  <div className="grid gap-2">
                    {timeSlotOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTimeSlot(option.value)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          timeSlot === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Details (optional) */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Workout details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Target distance"
                          value={targetDistance}
                          onChange={(e) => setTargetDistance(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="h-12"
                        />
                        <span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white">km</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <Input
                          type="text"
                          placeholder="Target duration (HH:MM:SS)"
                          value={targetDuration}
                          onChange={(e) => setTargetDuration(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="h-12 flex-1"
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Notes or instructions for this workout..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button variant="ghost" onClick={goBack} disabled={step === 0 || (skipDaySelection && step === 1)} className="gap-1">
              <ArrowLeft className="size-4" />
              Back
            </Button>

            <Button onClick={handleNext} disabled={!canProceed() || loading} className="gap-1">
              {step === 4 ? (
                <>
                  Create Workout
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
