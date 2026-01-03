import { Calendar, MapPin, Trophy, Target, Mountain, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import type { PriorityType } from "@/lib/types/type";
import type { RaceModel } from "../models/race.model";

// Helper for formatting time (seconds to HH:MM:SS)
const formatTime = (seconds?: number) => {
  if (!seconds) return "--:--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};

export function RaceDetailsDialog({ race, open, onOpenChange }: { race: RaceModel | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!race) return null;
  const priorityColors = {
    1: "bg-amber-100 text-amber-700 border-amber-200",
    2: "bg-slate-100 text-slate-700 border-slate-200",
    3: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={priorityColors[race.priority as PriorityType]}>
              Priority {race.priority}
            </Badge>
            {race.is_completed && <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>}
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">{race.name}</DialogTitle>
          <div className="flex items-center text-zinc-500 text-sm gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {new Date(race.race_date).toLocaleDateString()}
            </div>
            {race.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {race.location}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Distance</span>
            <div className="flex items-center gap-2 font-mono text-lg">
              <Trophy className="w-4 h-4 text-zinc-400" />
              {(race.distance_meters || 0) / 1000} <span className="text-xs">km</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Vertical Gain</span>
            <div className="flex items-center gap-2 font-mono text-lg">
              <Mountain className="w-4 h-4 text-zinc-400" />
              {race.elevation_gain_meters || 0} <span className="text-xs">m</span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-4">
          <section>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
              <Target className="w-3 h-3" /> Goals
            </h4>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
              <div className="text-sm font-medium text-zinc-600">Target Time</div>
              <div className="text-2xl font-mono font-bold text-zinc-900">{formatTime(race.target_time_seconds)}</div>
            </div>
          </section>

          {race.is_completed && (
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 flex items-center gap-2">
                <Trophy className="w-3 h-3" /> Performance
              </h4>
              <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-green-600 font-bold uppercase">Result</div>
                  <div className="font-mono font-bold text-lg">{formatTime(race.result_time_seconds)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-green-600 font-bold uppercase">Place</div>
                  <div className="font-mono font-bold text-lg">{race.result_place_overall || "-"}</div>
                </div>
              </div>
            </section>
          )}

          {race.notes && (
            <section>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
                <Info className="w-3 h-3" /> Notes
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed italic border-l-2 border-zinc-200 pl-3">"{race.notes}"</p>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
