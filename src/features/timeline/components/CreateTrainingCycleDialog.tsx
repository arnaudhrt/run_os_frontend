import { useMemo, useEffect } from "react";
import { Dialog, DialogContent } from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Loader2, ArrowRight, ArrowLeft, Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateTrainingCycleStore } from "../stores/create-training-cycle.store";
import type { RaceModel } from "../models/race.model";
import { phaseTypes } from "@/lib/types/type";
import type { CreateTrainingCycleParams } from "../controllers/training-cycle.controller";
import { format } from "date-fns";
import { formatDate, getDuration } from "../utils/training-cycle.utils";
import { phaseColors, TOTAL_STEPS } from "../utils/training-cycle.const";

interface CreateTrainingCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTrainingCycleParams) => void;
  loading?: boolean;
  races: RaceModel[];
}

export function CreateTrainingCycleDialog({ open, onOpenChange, onSubmit, loading, races }: CreateTrainingCycleDialogProps) {
  const {
    step,
    direction,
    name,
    endDateMode,
    raceId,
    raceDate,
    manualEndDate,
    startDate,
    phases,
    setName,
    setEndDateMode,
    setRaceId,
    setManualEndDate,
    setStartDate,
    initializePhases,
    updatePhaseWeeks,
    removePhase,
    addPhase,
    goNext,
    goBack,
    reset,
  } = useCreateTrainingCycleStore();

  // Filter future races only
  const futureRaces = useMemo(() => {
    const today = new Date();
    return races.filter((r) => new Date(r.race_date) > today).sort((a, b) => new Date(a.race_date).getTime() - new Date(b.race_date).getTime());
  }, [races]);

  // Get end date based on mode
  const endDate = endDateMode === "race" && raceDate ? raceDate : manualEndDate;

  // Calculate duration
  const duration = useMemo(() => {
    if (!startDate || !endDate) return { weeks: 0, months: 0 };
    return getDuration(startDate, endDate);
  }, [startDate, endDate]);

  // Total phase weeks
  const totalPhaseWeeks = useMemo(() => {
    return phases.reduce((sum, p) => sum + p.durationWeeks, 0);
  }, [phases]);

  const phasesMatch = totalPhaseWeeks === duration.weeks;

  // Get phases that are not yet added
  const availablePhases = useMemo(() => {
    const activePhaseTypes = new Set(phases.map((p) => p.phaseType));
    return phaseTypes.filter((pt) => !activePhaseTypes.has(pt));
  }, [phases]);

  // Initialize phases when entering step 3
  useEffect(() => {
    if (step === 3 && duration.weeks > 0) {
      initializePhases(duration.weeks);
    }
  }, [step, duration.weeks, initializePhases]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      ...(endDateMode === "race" && raceId ? { race_id: raceId } : {}),
      startDate: startDate,
      endDate: endDate,
      totalWeeks: duration.weeks,
      phases: phases.map((p) => ({ phaseType: p.phaseType, durationWeeks: p.durationWeeks })),
      onClose: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleNext = () => {
    console.log("Click");
    if (step < TOTAL_STEPS - 1) {
      goNext();
    } else {
      handleSubmit();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return name.trim().length > 0;
      case 1:
        return endDateMode === "race" ? !!raceId : !!manualEndDate;
      case 2:
        return !!startDate && duration.weeks > 0;
      case 3:
        return phases.length > 0 && phasesMatch;
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
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="p-6 min-h-[320px] flex flex-col">
          {/* Step indicator */}
          <div className="text-xs text-muted-foreground mb-6">
            Step {step + 1} of {TOTAL_STEPS}
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
              {/* Step 0: Name */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">What's the training cycle called?</h2>
                  <Input
                    type="text"
                    placeholder="e.g. Marathon Prep 2025"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="text-lg h-12"
                  />
                </div>
              )}

              {/* Step 1: End Date */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">When does it end?</h2>

                  {/* Mode toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(endDateMode === "race" && "bg-muted ring-2 ring-primary ring-offset-1")}
                      onClick={() => setEndDateMode("race")}
                    >
                      Select a race
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(endDateMode === "manual" && "bg-muted ring-2 ring-primary ring-offset-1")}
                      onClick={() => setEndDateMode("manual")}
                    >
                      Pick a date
                    </Button>
                  </div>

                  {endDateMode === "race" && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {futureRaces.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No upcoming races. Create a race first or pick a date manually.</p>
                      ) : (
                        futureRaces.map((race) => (
                          <button
                            key={race.id}
                            type="button"
                            onClick={() => setRaceId(race.id, new Date(race.race_date))}
                            className={cn(
                              "w-full p-3 rounded-lg border text-left transition-all",
                              raceId === race.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="font-medium">{race.name}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(race.race_date)}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {endDateMode === "manual" && (
                    <Input
                      type="date"
                      value={manualEndDate ? format(manualEndDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) setManualEndDate(new Date(value));
                      }}
                      className="h-12"
                    />
                  )}
                </div>
              )}

              {/* Step 2: Start Date */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">When does it start?</h2>
                  <Input
                    type="date"
                    value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) setStartDate(new Date(value));
                    }}
                    onKeyDown={handleKeyDown}
                    className="h-12"
                  />

                  {duration.weeks > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="text-lg font-medium">
                        {duration.weeks} weeks
                        <span className="text-muted-foreground font-normal"> ({duration.months} months)</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(startDate, "MMM d, yyyy")} → {format(endDate, "MMM d, yyyy")}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Phases */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Configure phases</h2>
                  <p className={cn("text-sm -mt-2", phasesMatch ? "text-muted-foreground" : "text-destructive font-medium")}>
                    {totalPhaseWeeks} / {duration.weeks} weeks
                    {!phasesMatch && ` (${totalPhaseWeeks > duration.weeks ? "+" : ""}${totalPhaseWeeks - duration.weeks})`}
                  </p>

                  <div className="space-y-2">
                    {phases.map((phase) => (
                      <div
                        key={phase.phaseType}
                        className={cn("flex items-center gap-3 p-3 rounded-lg border border-l-4", phaseColors[phase.phaseType])}
                      >
                        <span className="font-medium capitalize flex-1">{phase.phaseType}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={phase.durationWeeks}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value) updatePhaseWeeks(phase.phaseType, parseInt(value) || 1);
                            }}
                            className="h-8 w-16 text-center bg-background"
                          />
                          <span className="text-xs text-muted-foreground w-8">weeks</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhase(phase.phaseType)}
                          className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add phase buttons */}
                  {availablePhases.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availablePhases.map((phaseType) => {
                        if (phaseType === "off" || phaseType === "recovery") {
                          return null;
                        }
                        return (
                          <Button
                            key={phaseType}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addPhase(phaseType)}
                            className={cn("capitalize gap-1")}
                          >
                            <Plus className="size-3" />
                            {phaseType}
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  {!phasesMatch && <p className="text-sm text-destructive">Total weeks must equal {duration.weeks} to continue</p>}
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
              {step === TOTAL_STEPS - 1 ? (
                <>
                  Create Cycle
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
