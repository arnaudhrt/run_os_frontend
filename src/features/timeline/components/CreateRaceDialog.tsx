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
  onClose: () => void;
}

const priorityOptions = [
  { value: 1, label: "Primary", description: "Your main goal race" },
  { value: 2, label: "Secondary", description: "Important but not the focus" },
  { value: 3, label: "Training", description: "Part of your preparation" },
] as const;

const TOTAL_STEPS = 5;

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
    setName,
    setRaceDate,
    setRaceType,
    setPriority,
    setDistance,
    setElevation,
    goNext,
    goBack,
    reset,
  } = useCreateRaceStore();

  const isTrailRace = raceType === "trail" || raceType === "ultra_trail";

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
      isCompleted: false,
      ...(distance && { distance: parseFloat(distance) * 1000 }),
      ...(elevation && isTrailRace && { elevation: parseFloat(elevation) }),
      onClose: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleNext = () => {
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
        return raceDate.length > 0;
      case 2:
        return raceType !== undefined;
      case 3:
      case 4:
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
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="p-6 min-h-[280px] flex flex-col">
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
