import { Calendar, MapPin, Trophy, Target, Mountain, Info, Edit, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import { Button } from "@/lib/ui/button";
import type { PriorityType, RaceType } from "@/lib/types/type";
import type { RaceModel } from "../models/race.model";
import type { UpdateRaceParams } from "../controllers/race.controller";
import { Input } from "@/lib/ui/input";
import { useState } from "react";
import { formatRaceType, formatTimeToHHMMSS, parseTimeToSeconds } from "../utils/race.utils";

interface RaceDetailsDialogProps {
  race: RaceModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRace: (params: UpdateRaceParams) => void;
  loading: boolean;
}

export function RaceDetailsDialog({ race, open, onOpenChange, onUpdateRace, loading }: RaceDetailsDialogProps) {
  const [edit, setEdit] = useState<"goal" | "results" | null>(null);
  const [editTargetTime, setEditTargetTime] = useState(race?.target_time_seconds ? formatTimeToHHMMSS(race.target_time_seconds) : "");
  const [editResultTime, setEditResultTime] = useState(race?.result_time_seconds ? formatTimeToHHMMSS(race.result_time_seconds) : "");
  const [editPlaceOverall, setEditPlaceOverall] = useState(race?.result_place_overall?.toString() ?? "");
  const [editPlaceGender, setEditPlaceGender] = useState(race?.result_place_gender?.toString() ?? "");
  const [editPlaceCategory, setEditPlaceCategory] = useState(race?.result_place_category?.toString() ?? "");
  const [editCategoryName, setEditCategoryName] = useState(race?.category_name ?? "");
  if (!race) return null;

  const isTrailRace = (type: RaceType) => type === "trail" || type === "ultra_trail";
  const priorityColors = {
    1: "bg-amber-100 text-amber-700 border-amber-200",
    2: "bg-slate-100 text-slate-700 border-slate-200",
    3: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };

  const isPastRace = new Date(race.race_date) < new Date();
  const showTrailInfo = isTrailRace(race.race_type);

  const handleUpdateGoal = () => {
    if (!editTargetTime) return;
    onUpdateRace({ id: race.id, targetTime: parseTimeToSeconds(editTargetTime) ?? 0, onClose: () => setEdit(null) });
  };

  const handleUpdateResults = () => {
    if (!editResultTime) return;
    onUpdateRace({
      id: race.id,
      resultTime: parseTimeToSeconds(editResultTime) ?? 0,
      resultPlaceOverall: editPlaceOverall ? parseInt(editPlaceOverall) : undefined,
      resultPlaceGender: editPlaceGender ? parseInt(editPlaceGender) : undefined,
      resultPlaceCategory: editPlaceCategory ? parseInt(editPlaceCategory) : undefined,
      categoryName: editCategoryName,
      isCompleted: true,
      onClose: () => setEdit(null),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={priorityColors[race.priority as PriorityType]}>
              {race.priority === 1 && "Primary Race"}
              {race.priority === 2 && "Secondary Race"}
              {race.priority === 3 && "Training Race"}
            </Badge>
            <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-200">
              {formatRaceType(race.race_type)}
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

        <div className={`grid ${showTrailInfo ? "grid-cols-2" : "grid-cols-1"} gap-4 mt-4`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Distance</span>
            <div className="flex items-center gap-2 font-mono font-medium text-lg">
              <Trophy className="w-4 h-4 text-zinc-400" />
              {(race.distance_meters || 0) / 1000} <span className="text-xs">km</span>
            </div>
          </div>
          {showTrailInfo && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Vertical Gain</span>
              <div className="flex items-center gap-2 font-mono font-medium text-lg">
                <Mountain className="w-4 h-4 text-zinc-400" />
                {race.elevation_gain_meters || 0} <span className="text-xs">m</span>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <div className="space-y-4">
          {/* Goal Section */}
          <section>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                <Target className="w-3 h-3" /> Goal
              </h4>
              {edit === "goal" ? (
                <Button variant="ghost" size="icon" onClick={() => setEdit(null)}>
                  <X className="size-3.5 text-muted-foreground" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setEdit("goal")}>
                  <Edit className="size-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>

            {edit === "goal" ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Target time (HH:MM:SS)"
                  value={editTargetTime}
                  onChange={(e) => setEditTargetTime(e.target.value)}
                  className="h-12"
                />
                <Button variant="outline" size="sm" onClick={handleUpdateGoal} className="absolute top-1/2 -translate-y-1/2 right-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            ) : (
              <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Target:</span>
                  <span className="font-mono font-bold text-lg">{formatTimeToHHMMSS(race.target_time_seconds)}</span>
                </div>
              </div>
            )}
          </section>

          {/* Performance Section */}
          {isPastRace && (
            <section>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 flex items-center gap-2">
                  <Trophy className="w-3 h-3" /> Results
                </h4>
                {edit === "results" ? (
                  <Button variant="ghost" size="icon" onClick={() => setEdit(null)}>
                    <X className="size-3.5 text-muted-foreground" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setEdit("results")}>
                    <Edit className="size-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>

              {edit === "results" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Finish Time</label>
                    <Input type="text" placeholder="HH:MM:SS" value={editResultTime} onChange={(e) => setEditResultTime(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Overall position</label>
                      <Input type="number" placeholder="#" value={editPlaceOverall} onChange={(e) => setEditPlaceOverall(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Gender position</label>
                      <Input type="number" placeholder="#" value={editPlaceGender} onChange={(e) => setEditPlaceGender(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Category name</label>
                      <Input type="string" placeholder="18-29" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Category position</label>
                      <Input type="number" placeholder="#" value={editPlaceCategory} onChange={(e) => setEditPlaceCategory(e.target.value)} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleUpdateResults} className="w-full">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Results"}
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Finish Time</span>
                    <span className="font-mono font-bold text-lg">{formatTimeToHHMMSS(race.result_time_seconds)}</span>
                  </div>
                  {(race.result_place_overall || race.result_place_gender || race.result_place_category) && (
                    <div className="text-sm">
                      {race.result_place_overall && (
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-muted-foreground mr-2">Overall:</span>
                          <div className="flex items-center">
                            <span className="text-muted-foreground">#</span>
                            <span className="font-mono font-semibold text-base">{race.result_place_overall}</span>
                          </div>
                        </div>
                      )}
                      {race.result_place_gender && (
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-muted-foreground mr-2">Gender:</span>
                          <div className="flex items-center">
                            <span className="text-muted-foreground">#</span>
                            <span className="font-mono font-semibold text-base">{race.result_place_gender}</span>
                          </div>
                        </div>
                      )}
                      {race.result_place_category && (
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-muted-foreground mr-2">{race.category_name || "Category"}:</span>
                          <div className="flex items-center">
                            <span className="text-muted-foreground">#</span>
                            <span className="font-mono font-semibold text-base">{race.result_place_category}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
