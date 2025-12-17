import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { useState } from "react";
import { useSeasonController } from "../controllers/season.controller";
import { Loader, X } from "lucide-react";
import DatePicker from "./DatePicker";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/lib/ui/alert-dialog";

export default function CreateSeasonDialog({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const { handleCreateSeason, validationsErrors, apiError, loading } = useSeasonController();

  const presets = [
    { label: "3 months", months: 3 },
    { label: "6 months", months: 6 },
    { label: "9 months", months: 9 },
    { label: "1 year", months: 12 },
  ];

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="cursor-pointer" asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <h2 className="font-lg font-semibold">Create New Season</h2>
        <div className="space-y-5 w-full max-w-sm mx-auto">
          <div className="space-y-1">
            <Label htmlFor="first-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="first-name"
              placeholder="2025 - Sub 3h Marathon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 rounded-lg"
              required
            />
            {validationsErrors?.name && <p className="text-xs text-red-600 mt-1">{validationsErrors.name}</p>}
          </div>
          <div className="flex gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.months}
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={() => {
                  const now = new Date();
                  const end = new Date(now);
                  end.setMonth(end.getMonth() + preset.months);
                  setStartDate(now);
                  setEndDate(end);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Start date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
              {validationsErrors?.name && <p className="text-xs text-red-600 mt-1">{validationsErrors.name}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">End date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
              {validationsErrors?.name && <p className="text-xs text-red-600 mt-1">{validationsErrors.lastName}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-11 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
            onClick={() => handleCreateSeason({ name, startDate, endDate, onClose: handleClose })}
            disabled={!startDate || !endDate || !name || loading.create}
          >
            <span>Create season</span>
            {loading.create && <Loader className="h-4 w-4 animate-spin" />}
          </Button>

          {apiError && (
            <div className="text-center">
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{apiError}</p>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full cursor-pointer" onClick={() => setOpen(false)}>
          <X className="size-5" />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
