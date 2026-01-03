import { Dialog, DialogContent } from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { raceTypes, type RaceType } from "@/lib/types/type";
import { cn } from "@/lib/utils";
import { useCreateRaceStore } from "../stores/create-race.store";

interface CreateRaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRaceData) => void;
  loading?: boolean;
}

interface CreateRaceData {
  name: string;
  raceDate: Date;
  raceType: RaceType;
  priority: 1 | 2 | 3;
  isCompleted: boolean;
  distance?: number;
  elevation?: number;
  resultTimeSeconds?: number;
  resultPlaceOverall?: number;
  resultPlaceGender?: number;
  resultPlaceCategory?: number;
  categoryName?: string;
  onClose: () => void;
}

const priorityOptions = [
  { value: 1, label: "Primary", description: "Your main goal race" },
  { value: 2, label: "Secondary", description: "Important but not the focus" },
  { value: 3, label: "Training", description: "Part of your preparation" },
] as const;

function parseTimeToSeconds(time: string): number | undefined {
  if (!time) return undefined;
  const parts = time.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return undefined;
}

function formatRaceType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CreateRaceDialog({ open, onOpenChange, onSubmit, loading }: CreateRaceDialogProps) {
  const {
    step,
    direction,
    name,
    raceDate,
    raceType,
    priority,
    distance,
    elevation,
    resultTime,
    resultPlaceOverall,
    resultPlaceGender,
    resultPlaceCategory,
    categoryName,
    setName,
    setRaceDate,
    setRaceType,
    setPriority,
    setDistance,
    setElevation,
    setResultTime,
    setResultPlaceOverall,
    setResultPlaceGender,
    setResultPlaceCategory,
    setCategoryName,
    goNext,
    goBack,
    reset,
  } = useCreateRaceStore();

  const isTrailRace = raceType === "trail" || raceType === "ultra_trail";
  const isPastRace = raceDate && new Date(raceDate) < new Date(new Date().toDateString());
  const totalSteps = isPastRace ? 6 : 5;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      raceDate: new Date(raceDate),
      raceType,
      priority,
      isCompleted: !!isPastRace,
      ...(distance && { distance: parseFloat(distance) * 1000 }),
      ...(elevation && isTrailRace && { elevation: parseFloat(elevation) }),
      ...(isPastRace && resultTime && { resultTimeSeconds: parseTimeToSeconds(resultTime) }),
      ...(isPastRace && resultPlaceOverall && { resultPlaceOverall: parseInt(resultPlaceOverall) }),
      ...(isPastRace && resultPlaceGender && { resultPlaceGender: parseInt(resultPlaceGender) }),
      ...(isPastRace && resultPlaceCategory && { resultPlaceCategory: parseInt(resultPlaceCategory) }),
      ...(isPastRace && categoryName && { categoryName }),
      onClose: () => {
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
        return name.trim().length > 0;
      case 1:
        return raceDate.length > 0;
      case 2:
        return raceType !== undefined;
      case 3:
      case 4:
      case 5:
        return true;
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

        <div className="p-6 min-h-[280px] flex flex-col">
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
              {/* Step 0: Name */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">What's the race called?</h2>
                  <Input
                    type="text"
                    placeholder="e.g. Paris Marathon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="text-lg h-12"
                  />
                </div>
              )}

              {/* Step 1: Date */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">When is it?</h2>
                  <Input
                    type="date"
                    value={raceDate}
                    onChange={(e) => setRaceDate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="text-lg h-12"
                  />
                </div>
              )}

              {/* Step 2: Race Type */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">What type of race?</h2>
                  <div className="flex flex-wrap gap-2">
                    {raceTypes.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={`${raceType === type && "bg-muted/50 ring-2 ring-primary ring-offset-1"}`}
                        onClick={() => setRaceType(type)}
                      >
                        {formatRaceType(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Priority */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">How important is this race?</h2>
                  <div className="grid gap-2">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriority(option.value)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          priority === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Distance & Elevation */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Race details</h2>
                  <p className="text-sm text-muted-foreground -mt-2">Optional - you can skip this</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Distance"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12"
                      />
                      <span className="text-muted-foreground w-8">km</span>
                    </div>
                    {isTrailRace && (
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder="Elevation gain"
                          value={elevation}
                          onChange={(e) => setElevation(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="h-12"
                        />
                        <span className="text-muted-foreground w-8">m</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Results (only for past races) */}
              {step === 5 && isPastRace && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Race results</h2>
                  <p className="text-sm text-muted-foreground -mt-2">Optional - you can skip this</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        placeholder="Finish time (HH:MM:SS)"
                        value={resultTime}
                        onChange={(e) => setResultTime(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Overall position"
                        value={resultPlaceOverall}
                        onChange={(e) => setResultPlaceOverall(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Gender position"
                        value={resultPlaceGender}
                        onChange={(e) => setResultPlaceGender(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Category name (e.g 18-29)"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Category position"
                        value={resultPlaceCategory}
                        onChange={(e) => setResultPlaceCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 flex-1"
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
                  Create Race
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
