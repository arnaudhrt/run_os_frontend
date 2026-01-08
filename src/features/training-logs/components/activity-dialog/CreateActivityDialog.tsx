import { Dialog, DialogContent } from "@/lib/ui/dialog";
import { NativeSelect, NativeSelectOption } from "@/lib/ui/native-select";
import { Checkbox } from "@/lib/ui/checkbox";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { activityTypes, runningWorkoutTypes, strengthWorkoutTypes, cardioWorkoutTypes, pain, type WorkoutType, type Pain, rpe as rpeOptions } from "@/lib/types/type";
import { cn } from "@/lib/utils";
import { useCreateActivityStore } from "../../stores/create-activity.store";
import type { CreateActivityParams } from "../../controllers/activity.controller";
import { formatActivityType, formatRpe, formatWorkoutType } from "../../utils/format";

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateActivityParams) => void;
  loading?: boolean;
}

export function CreateActivityDialog({ open, onOpenChange, onSubmit, loading }: CreateActivityDialogProps) {
  const {
    step,
    direction,
    activityType,
    workoutType,
    startTime,
    distance,
    hours,
    minutes,
    seconds,
    elevation,
    avgHeartRate,
    maxHeartRate,
    rpe,
    hasPain,
    painLocation,
    notes,
    setActivityType,
    setWorkoutType,
    setStartTime,
    setDistance,
    setHours,
    setMinutes,
    setSeconds,
    setElevation,
    setAvgHeartRate,
    setMaxHeartRate,
    setRpe,
    setHasPain,
    setPainLocation,
    setNotes,
    goNext,
    goBack,
    reset,
  } = useCreateActivityStore();

  const isRunningActivity = activityType === "run" || activityType === "trail" || activityType === "treadmill";
  const isCardioActivity = activityType === "cardio";
  const showWorkoutType = activityType !== "hike";
  const workoutTypeOptions = isRunningActivity ? runningWorkoutTypes : isCardioActivity ? cardioWorkoutTypes : strengthWorkoutTypes;

  const totalSteps = 4;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  const handleSubmit = () => {
    const durationSeconds = parseInt(hours || "0") * 3600 + parseInt(minutes || "0") * 60 + parseInt(seconds || "0");

    onSubmit({
      activityType,
      ...(workoutType && { workoutType }),
      startTime: new Date(startTime).toISOString(),
      ...(distance && { distanceMeters: parseFloat(distance) * 1000 }),
      ...(durationSeconds > 0 && { durationSeconds }),
      ...(elevation && { elevationGainMeters: parseFloat(elevation) }),
      ...(avgHeartRate && { avgHeartRate: parseInt(avgHeartRate) }),
      ...(maxHeartRate && { maxHeartRate: parseInt(maxHeartRate) }),
      ...(rpe && { rpe: rpe }),
      ...(hasPain && painLocation && { hasPain: painLocation }),
      ...(notes && { notes }),
      resetForm: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      goNext();
    } else {
      handleSubmit();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return activityType !== undefined && workoutType !== undefined;
      case 1:
        return startTime.length > 0;
      case 2:
        return true; // Distance and duration are optional
      case 3:
        return true; // All optional
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
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        <div className="p-6 min-h-80 flex flex-col">
          {/* Step indicator */}
          <div className="text-xs text-muted-foreground mb-6">
            Step {step + 1} of {totalSteps}
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
              {/* Step 0: Activity & Workout Type */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h2 className="text-xl font-medium">What type of activity?</h2>
                    <div className="flex flex-wrap gap-2">
                      {activityTypes.map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          className={cn(activityType === type && "bg-muted/50 ring-2 ring-primary ring-offset-1")}
                          onClick={() => setActivityType(type)}
                        >
                          {formatActivityType(type)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {showWorkoutType && (
                    <div className="space-y-3">
                      <h2 className="text-lg font-medium text-muted-foreground">What kind of workout?</h2>
                      <div className="flex flex-wrap gap-2">
                        {workoutTypeOptions.map((type) => (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            className={cn(workoutType === type && "bg-muted/50 ring-2 ring-primary ring-offset-1")}
                            onClick={() => setWorkoutType(type as WorkoutType)}
                          >
                            {formatWorkoutType(type)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">When did you do it?</h2>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="text-lg h-12"
                  />
                </div>
              )}

              {/* Step 2: Distance & Duration */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h2 className="text-xl font-medium">How far did you go?</h2>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="h-12 text-lg"
                      />
                      <span className="text-muted-foreground w-8">km</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-lg font-medium text-muted-foreground">How long did it take?</h2>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 w-full text-center"
                      />
                      <span className="text-sm text-muted-foreground">h</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 w-full text-center"
                      />
                      <span className="text-sm text-muted-foreground">m</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 w-full text-center"
                      />
                      <span className="text-sm text-muted-foreground">s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Optional Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-medium">Any extra details?</h2>
                    <p className="text-sm text-muted-foreground">All optional - feel free to skip</p>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto scrollable pr-2">
                    {/* Elevation (for trail/hike) */}
                    {(activityType === "trail" || activityType === "hike") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Elevation Gain</label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            placeholder="0"
                            value={elevation}
                            onChange={(e) => setElevation(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-10"
                          />
                          <span className="text-muted-foreground w-8">m</span>
                        </div>
                      </div>
                    )}

                    {/* Heart Rate */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Avg Heart Rate</p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={avgHeartRate}
                            onChange={(e) => setAvgHeartRate(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-10"
                          />
                          <span className="text-muted-foreground text-sm">bpm</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Max Heart Rate</p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={maxHeartRate}
                            onChange={(e) => setMaxHeartRate(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-10"
                          />
                          <span className="text-muted-foreground text-sm">bpm</span>
                        </div>
                      </div>
                    </div>

                    {/* RPE */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">How hard was it? (RPE)</p>
                      <div className="grid gap-1.5">
                        {rpeOptions.map((option) => {
                          const value = option;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRpe(rpe === option ? null : value)}
                              className={cn(
                                "p-2 rounded-lg border text-left transition-all text-sm",
                                rpe === option ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{formatRpe(option)}</span>
                                <span className="text-muted-foreground text-xs">{option}/5</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pain/Discomfort */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="has-pain" checked={hasPain} onCheckedChange={(checked: boolean) => setHasPain(checked)} />
                        <label htmlFor="has-pain" className="text-sm font-medium cursor-pointer">
                          Had pain or discomfort
                        </label>
                      </div>
                      {hasPain && (
                        <NativeSelect
                          value={painLocation || ""}
                          onChange={(e) => setPainLocation(e.target.value as Pain)}
                          className="w-full"
                        >
                          <NativeSelectOption value="">Select location...</NativeSelectOption>
                          {pain.map((location) => (
                            <NativeSelectOption key={location} value={location}>
                              {location.charAt(0).toUpperCase() + location.slice(1)}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Notes</p>
                      <Textarea
                        placeholder="How did it feel? Any observations..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1">
              <ArrowLeft className="size-4" />
              Back
            </Button>

            <Button onClick={handleNext} disabled={!canProceed() || loading} className="gap-1">
              {step === totalSteps - 1 ? (
                <>
                  Create Activity
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
