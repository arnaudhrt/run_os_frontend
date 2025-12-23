import { Footprints, Mountain, Quote, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import type { PhaseModel } from "../models/phase.model";
import { cn } from "@/lib/utils";

export function PhaseDetailsDialog({
  phase,
  open,
  onOpenChange,
}: {
  phase: PhaseModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!phase) return null;
  const phaseStyles = {
    base: "bg-blue-50 text-blue-700 border-blue-200",
    build: "bg-indigo-50 text-indigo-700 border-indigo-200",
    peak: "bg-purple-50 text-purple-700 border-purple-200",
    taper: "bg-orange-50 text-orange-700 border-orange-200",
    recovery: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const startDate = new Date(phase.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endDate = new Date(phase.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className={cn("capitalize font-bold px-3 py-1", phaseStyles[phase.phase_type as keyof typeof phaseStyles])}>
              {phase.phase_type} Phase
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold mt-2">
            {startDate} — {endDate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Main Targets Card */}
          <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-xl overflow-hidden shadow-inner">
            <div className="bg-white p-4 flex flex-col items-center justify-center text-center">
              <Footprints className="w-5 h-5 text-zinc-400 mb-2" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Weekly Volume</span>
              <div className="text-2xl font-mono font-bold">
                {phase.weekly_volume_target_km} <span className="text-xs text-zinc-500">km</span>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col items-center justify-center text-center">
              <Mountain className="w-5 h-5 text-zinc-400 mb-2" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Weekly Vert</span>
              <div className="text-2xl font-mono font-bold">
                {phase.weekly_elevation_target_m} <span className="text-xs text-zinc-500">m</span>
              </div>
            </div>
          </div>

          {/* Strategy / Description */}
          {phase.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Quote className="w-3 h-3" /> Focus & Strategy
              </h4>
              <div className="text-sm text-zinc-700 bg-zinc-50 p-4 rounded-lg border border-zinc-100 leading-relaxed">{phase.description}</div>
            </div>
          )}

          {/* Logic check or linked race info */}
          {phase.race_id && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100/50 p-2 rounded justify-center">
              <TrendingUp className="w-3 h-3" />
              Linked to specific race objective
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
