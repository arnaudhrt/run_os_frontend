import { Calendar, TrendingUp, Heart, Trophy, Trash, Edit, Smile, SunSnow, Notebook, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/ui/dialog";
import { Badge } from "@/lib/ui/badge";
import { Separator } from "@/lib/ui/separator";
import { Button } from "@/lib/ui/button";
import { format } from "date-fns";
import type { ActivityModel } from "../../models/activity.model";
import { formatDistance, formatDuration, formatWorkoutType, renderPace, formatRpe, formatHasPain, formatAvgTemperature } from "../../utils/format";
import DeleteDialog from "./DeleteActivityDialog";
import { UpdateActivityDialog } from "./UpdateActivityDialog";
import { ActivityBadge } from "../data-table/ActivityBadge";
import { useState } from "react";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";
import { rpe, pain } from "@/lib/types/type";
import type { UpdateActivityParams } from "../../controllers/activity.controller";

interface ActivityDetailDialogProps {
  activity: ActivityModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedActivity: (activity: ActivityModel | null) => void;
  deleteActivity: (activityId: string, onClose: () => void) => Promise<void>;
  updateActivity: (params: UpdateActivityParams) => Promise<void>;
  loadingUpdate?: boolean;
  loadingDelete?: boolean;
}

export function ActivityDetailDialog({ activity, open, onOpenChange, setSelectedActivity, deleteActivity, updateActivity, loadingUpdate, loadingDelete }: ActivityDetailDialogProps) {
  const [edit, setEdit] = useState<string>("");
  const [editAvgHeartRate, setEditAvgHeartRate] = useState<number | null>(activity?.avg_heart_rate ? activity.avg_heart_rate : null);
  const [editMaxHeartRate, setEditMaxHeartRate] = useState<number | null>(activity?.max_heart_rate ? activity.max_heart_rate : null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  // TODO: Pass loadingDelete to DeleteDialog when it supports loading state
  void loadingDelete;
  if (!activity) return null;

  const sourceColors = {
    garmin: "text-blue-700 border-blue-300",
    strava: "text-orange-700 border-orange-300",
    manual: "text-zinc-600 border-zinc-300",
  };

  const isTrailOrHike = activity.activity_type === "trail" || activity.activity_type === "hike";
  const isRunning = activity.activity_type === "run" || activity.activity_type === "treadmill";
  const isStrength = activity.activity_type === "strength";

  const renderMainStats = () => {
    if (isRunning) return <RunningMainStats activity={activity} />;
    if (isTrailOrHike) return <TrailMainStats activity={activity} />;
    if (isStrength) return <StrengthMainStats activity={activity} />;
    return null;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        setSelectedActivity(null);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <ActivityBadge type={activity.activity_type} />
            {activity.workout_type && <Badge variant="outline">{formatWorkoutType(activity.workout_type)}</Badge>}

            <Badge variant="outline" className={sourceColors[activity.source] || sourceColors.manual}>
              {activity.source.charAt(0).toUpperCase() + activity.source.slice(1)}
            </Badge>
            {activity.is_pr && (
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Trophy className="w-3 h-3 mr-1" />
                PR
              </Badge>
            )}
          </div>
          <div className="flex items-end gap-3">
            <DialogTitle className="text-2xl font-bold tracking-tight">{format(new Date(activity.start_time), "EEEE, MMMM do")}</DialogTitle>
            <div className="flex items-center">
              <Button variant="ghost" className="text-slate-600  hover:text-slate-700 hover:bg-slate-50 h-auto size-7 rounded-md" onClick={() => setOpenUpdateDialog(true)}>
                <Edit className="size-3.5" />
              </Button>
              <DeleteDialog onDelete={() => deleteActivity(activity.id, () => onOpenChange(false))}>
                <Button variant="ghost" className="text-red-600  hover:text-red-700 hover:bg-red-50 h-auto size-7 rounded-md">
                  <Trash className="size-3.5" />
                </Button>
              </DeleteDialog>
            </div>
          </div>
          <div className="flex items-center text-zinc-500 text-sm gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(activity.start_time), "h:mm a")}
            </div>
          </div>
        </DialogHeader>

        {/* Main Stats */}
        {renderMainStats()}

        <Separator className="" />

        <div className="flex items-center gap-3">
          <section className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-600" /> Heart Rate
              </h4>
              {edit === "hr" ? (
                <Button variant="ghost" size="sm" className="text-xs h-6 p-1" onClick={() => setEdit("")}>
                  <Check className="size-3 text-muted-foreground" /> Save
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setEdit("hr")}>
                  <Edit className="size-3 text-muted-foreground" />
                </Button>
              )}
            </div>

            <div className="bg-slate-50/50 p-3 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Avg. HR:</span>
                <div className="flex gap-1 items-center">
                  {edit === "hr" ? (
                    <Input
                      type="number"
                      placeholder="Max. HR (bpm)"
                      value={editAvgHeartRate ?? 0}
                      onChange={(e) => setEditAvgHeartRate(Number(e.target.value))}
                      className="max-w-16 h-6"
                    />
                  ) : (
                    <span className="font-mono font-bold text-sm">{activity.avg_heart_rate ?? "-"}</span>
                  )}
                  <span className="font-mono font-bold text-sm">bpm</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Max HR:</span>
                <div className="flex gap-1 items-center">
                  {edit === "hr" ? (
                    <Input
                      type="number"
                      placeholder="Max. HR (bpm)"
                      value={editMaxHeartRate ?? 0}
                      onChange={(e) => setEditMaxHeartRate(Number(e.target.value))}
                      className="max-w-16 h-6"
                    />
                  ) : (
                    <span className="font-mono font-bold text-sm">{activity.max_heart_rate ?? "-"}</span>
                  )}
                  <span className="font-mono font-bold text-sm">bpm</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Smile className="w-3 h-3 text-slate-600" /> Feelings
              </h4>
              {edit === "feelings" ? (
                <Button variant="ghost" size="sm" className="text-xs h-6 p-1" onClick={() => setEdit("")}>
                  <Check className="size-3 text-muted-foreground" /> Save
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setEdit("feelings")}>
                  <Edit className="size-3 text-muted-foreground" />
                </Button>
              )}
            </div>

            <div className="bg-slate-50/50 p-3 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Effort (RPE):</span>
                {edit === "feelings" ? (
                  <Select defaultValue={activity.rpe?.toString() ?? ""}>
                    <SelectTrigger size="sm" className="h-6 w-auto text-xs">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {rpe.map((el) => (
                        <SelectItem key={el} value={el.toString()}>
                          {formatRpe(el)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-mono font-bold text-sm">{formatRpe(activity.rpe)}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Pain / Discomfort:</span>
                {edit === "feelings" ? (
                  <Select defaultValue={activity.has_pain ?? ""}>
                    <SelectTrigger size="sm" className="h-6 w-auto text-xs">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {pain.map((el) => (
                        <SelectItem key={el} value={el}>
                          {formatHasPain(el)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-mono font-bold text-sm">{formatHasPain(activity.has_pain)}</span>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <SunSnow className="w-3 h-3 text-green-600" /> Environment
            </h4>
            {edit === "env" ? (
              <Button variant="ghost" size="sm" className="text-xs h-6 p-1" onClick={() => setEdit("")}>
                <Check className="size-3 text-muted-foreground" /> Save
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setEdit("env")}>
                <Edit className="size-3 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="bg-slate-50/50 p-3 rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Avg. Temperature:</span>
              {edit === "env" ? (
                <div className="flex gap-1 items-center">
                  <Input type="number" placeholder="Temp" value={activity.avg_temperature_celsius ?? ""} className="max-w-20 h-6" />
                  <span className="font-mono font-bold text-sm">°C</span>
                </div>
              ) : (
                <span className="font-mono font-bold text-sm">{formatAvgTemperature(activity.avg_temperature_celsius)}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Shoes:</span>
              {edit === "env" ? (
                <Input type="text" placeholder="Shoes" value="Asics Novablast 5" className="max-w-50 h-6" />
              ) : (
                <span className="font-mono font-bold text-sm">Asics Novablast 5</span>
              )}
            </div>
          </div>
        </section>

        <section className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Notebook className="w-3 h-3 text-blue-600" /> Notes
            </h4>
            {edit === "notes" ? (
              <Button variant="ghost" size="sm" className="text-xs h-6 p-1" onClick={() => setEdit("")}>
                <Check className="size-3 text-muted-foreground" /> Save
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setEdit("notes")}>
                <Edit className="size-3 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="bg-slate-50/50 p-3 rounded-lg border space-y-2">
            {edit === "notes" ? (
              <Textarea placeholder="Add notes about this activity..." value={activity.notes ?? ""} />
            ) : (
              <p className="text-sm">{activity.notes || "No notes provided for this activity."}</p>
            )}
          </div>
        </section>
      </DialogContent>

      <UpdateActivityDialog
        activity={activity}
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        onSubmit={updateActivity}
        loading={loadingUpdate}
      />
    </Dialog>
  );
}

function RunningMainStats({ activity }: { activity: ActivityModel }) {
  return (
    <div className={`grid grid-cols-3 gap-4 mt-4`}>
      <div className="space-y-1 justify-self-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center">Distance</p>
        <div className="font-mono font-semibold text-lg text-center">{formatDistance(activity.distance_meters || 0)}</div>
      </div>

      <div className={`space-y-1 justify-self-center`}>
        <p className={`text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center`}>Duration</p>
        <div className={`font-mono font-semibold text-lg text-center`}>{formatDuration(activity.duration_seconds || 0)}</div>
      </div>

      <div className="space-y-1 justify-self-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center">Pace (min/km)</p>
        <div className="font-mono font-semibold text-lg text-center">{renderPace(activity.distance_meters, activity.duration_seconds)}</div>
      </div>
    </div>
  );
}

function TrailMainStats({ activity }: { activity: ActivityModel }) {
  return (
    <div className={`grid grid-cols-3 gap-4 mt-4`}>
      <div className="space-y-1 justify-self-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center">Distance</p>
        <div className="font-mono font-semibold text-lg text-center">{formatDistance(activity.distance_meters || 0)}</div>
      </div>

      <div className={`space-y-1 justify-self-center`}>
        <p className={`text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center`}>Duration</p>
        <div>
          <div className={`font-mono font-semibold text-lg text-center`}>{formatDuration(activity.duration_seconds || 0)}</div>
          {activity.activity_type !== "hike" && (
            <p className="text-xs font-mono text-muted-foreground -mt-0.5">{renderPace(activity.distance_meters, activity.duration_seconds, true)}</p>
          )}
        </div>
      </div>

      <div className="space-y-1 justify-self-center">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-center">Elevation</span>
        <div className="flex items-center gap-1 font-mono font-semibold text-lg text-center">
          <TrendingUp className="w-4 h-4 text-zinc-400" />
          {activity.elevation_gain_meters || 0} <span className="text-xs">m</span>
        </div>
      </div>
    </div>
  );
}

function StrengthMainStats({ activity }: { activity: ActivityModel }) {
  return (
    <div className={`grid grid-cols-2 gap-4 mt-4`}>
      <div className={`space-y-1 justify-self-center`}>
        <p className={`text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center`}>Duration</p>
        <div className={`font-mono font-semibold text-lg text-center`}>{formatDuration(activity.duration_seconds || 0)}</div>
      </div>

      <div className="space-y-1 justify-self-center">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-center">Workout Type</span>
        <div className="font-mono font-semibold text-lg text-center">{formatWorkoutType(activity.workout_type)}</div>
      </div>
    </div>
  );
}
