import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Textarea } from "@/lib/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { raceTypes, type RaceType } from "@/lib/types/type";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";

interface CreateRaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRaceParams) => void;
  loading?: boolean;
}

export interface CreateRaceParams {
  name: string;
  raceDate: Date;
  raceType: RaceType;
  priority: 1 | 2 | 3;
  isCompleted: boolean;
  elevation?: number;
  distance?: number;
  targetTime?: number;
  location?: string;
  notes?: string;
  onClose: () => void;
}

const optionalFieldsInitial = [
  { value: "elevation", label: "Elevation Gain" },
  { value: "distance", label: "Distance" },
  { value: "targetTime", label: "Target Time" },
  { value: "location", label: "Location" },
  { value: "notes", label: "Notes" },
];

const priorityLabels: Record<1 | 2 | 3, string> = {
  1: "Primary race",
  2: "Secondary race",
  3: "Training race",
};

function formatRaceType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CreateRaceDialog({ open, onOpenChange, onSubmit, loading }: CreateRaceDialogProps) {
  const [name, setName] = useState("");
  const [raceDate, setRaceDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  });
  const [raceType, setRaceType] = useState<RaceType>("marathon");
  const [priority, setPriority] = useState<1 | 2 | 3>(1);

  // Optional fields
  const [selectedFields, setSelectedFields] = useState<{ value: string; label: string }[]>([]);
  const [optionalFields, setOptionalFields] = useState<{ value: string; label: string }[]>(optionalFieldsInitial);
  const [openOptions, setOpenOptions] = useState(false);
  const [elevation, setElevation] = useState("");
  const [distance, setDistance] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("");
  const [targetSeconds, setTargetSeconds] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

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
      case "distance":
        setDistance("");
        break;
      case "targetTime":
        setTargetHours("");
        setTargetMinutes("");
        setTargetSeconds("");
        break;
      case "location":
        setLocation("");
        break;
      case "notes":
        setNotes("");
        break;
    }
  };

  const resetForm = () => {
    setName("");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setRaceDate(now.toISOString().slice(0, 10));
    setRaceType("marathon");
    setPriority(1);
    setSelectedFields([]);
    setOptionalFields(optionalFieldsInitial);
    setElevation("");
    setDistance("");
    setTargetHours("");
    setTargetMinutes("");
    setTargetSeconds("");
    setLocation("");
    setNotes("");
  };

  const handleSubmit = () => {
    const fields = selectedFields.map((f) => f.value);
    const targetTimeSeconds = parseInt(targetHours || "0") * 3600 + parseInt(targetMinutes || "0") * 60 + parseInt(targetSeconds || "0");

    onSubmit({
      name,
      raceDate: new Date(raceDate),
      raceType,
      priority,
      isCompleted: false,
      ...(fields.includes("elevation") && elevation && { elevation: parseFloat(elevation) }),
      ...(fields.includes("distance") && distance && { distance: parseFloat(distance) * 1000 }),
      ...(fields.includes("targetTime") && targetTimeSeconds > 0 && { targetTime: targetTimeSeconds }),
      ...(fields.includes("location") && location && { location }),
      ...(fields.includes("notes") && notes && { notes }),
      onClose: () => {
        resetForm();
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg!">
        <DialogHeader>
          <DialogTitle>Create Race</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[600px]! scrollable overflow-y-auto!">
          {/* Race Name */}
          <div className="space-y-1.5">
            <Label>Race Name</Label>
            <Input type="text" placeholder="e.g. Paris Marathon" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Race Type & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Race Type</Label>
              <Select value={raceType} onValueChange={(v) => setRaceType(v as RaceType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1">
                  {raceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatRaceType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority.toString()} onValueChange={(v) => setPriority(parseInt(v) as 1 | 2 | 3)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([1, 2, 3] as const).map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {priorityLabels[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Race Date</Label>
            <Input type="date" value={raceDate} onChange={(e) => setRaceDate(e.target.value)} />
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

              {field.value === "distance" && (
                <div className="flex items-center gap-2">
                  <Input type="number" step="0.01" placeholder="0.00" value={distance} onChange={(e) => setDistance(e.target.value)} />
                  <span className="text-sm text-muted-foreground w-8">km</span>
                </div>
              )}

              {field.value === "targetTime" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={targetHours}
                    onChange={(e) => setTargetHours(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">h</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">m</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={targetSeconds}
                    onChange={(e) => setTargetSeconds(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">s</span>
                </div>
              )}

              {field.value === "location" && (
                <Input type="text" placeholder="e.g. Paris, France" value={location} onChange={(e) => setLocation(e.target.value)} />
              )}

              {field.value === "notes" && (
                <Textarea placeholder="Add notes about this race..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-20" />
              )}
            </div>
          ))}

          {optionalFields.length > 0 && (
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
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            Create Race
            {loading && <Loader2 className="size-4 animate-spin mr-1" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
