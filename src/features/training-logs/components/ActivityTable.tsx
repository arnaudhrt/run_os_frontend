import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/ui/table";
import { formatDistance, formatDuration, formatElevation, formatWorkoutType, formatAvgMaxHR, speedToPaceFormatted, formatRpe } from "../utils/format";
import type { ActivityModel, DayEntry, WeekEntry } from "../models/activity.model";
import { format } from "date-fns";
import { ActivityBadge } from "./ActivityBadge";
import { FileText, Mountain, Timer, Map, Plus, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { ActivityDetailsDialog } from "./ActivityDetailsDialog";
import { useState } from "react";
import { TrainingEffectBadge } from "./TrainingEffectBadge";
import { Button } from "@/lib/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { rpe, workoutTypes } from "@/lib/types/type";
import { Textarea } from "@/lib/ui/textarea";
import type { LoadingState, UpdateActivityParams } from "../controllers/activity.controller";

export default function ActivityTable({
  week,
  days,
  handleUpdateActivity,
  loading,
}: {
  week: WeekEntry | null;
  days: DayEntry[];
  handleUpdateActivity: (params: UpdateActivityParams) => void;
  loading: LoadingState;
}) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [activePopover, setActivePopover] = useState<string | null>(null);

  if (!week || !days) return null;
  return (
    <div>
      <div className="flex gap-6 text-xs font-mono text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Map className="size-4" />
          <span>{formatDistance(week.totals.distance_meters)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer className="size-4" />
          <span className="hidden md:inline">{formatDuration(week.totals.duration_seconds)}</span>
        </div>
        {week.totals.elevation_gain_meters && week.totals.elevation_gain_meters > 0 && (
          <div className="flex items-center gap-1">
            <Mountain className="size-4" />
            <span className="hidden md:inline">{formatElevation(week.totals.elevation_gain_meters)}</span>
          </div>
        )}
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 uppercase text-[10px] font-bold tracking-widest">
              <TableHead className="font-bold text-[10px] tracking-widest uppercase">Date</TableHead>
              <TableHead className="font-bold text-[10px] tracking-widest uppercase">Activity</TableHead>
              <TableHead className="font-bold text-[10px] tracking-widest uppercase">Type</TableHead>
              <TableHead className="font-bold text-[10px] tracking-widest uppercase">Training Effect</TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Distance</TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Time</TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">
                <Tooltip>
                  <TooltipTrigger>
                    <span className="font-bold text-[10px] tracking-widest uppercase">Pace</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>min/km</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Avg/Max HR</TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">Elev</TableHead>
              <TableHead className="text-right font-bold text-[10px] tracking-widest uppercase">RPE</TableHead>
              <TableHead className="text-center font-bold text-[10px] tracking-widest uppercase">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day, index) => {
              if (day.isRestDay) {
                return (
                  <TableRow key={index} className="font-mono text-sm bg-gray-50 hover:bg-gray-50">
                    <TableCell className="font-medium font-sans whitespace-nowrap">{format(new Date(day.date), "EEE do")}</TableCell>
                    <TableCell>
                      <ActivityBadge type="rest_day" />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              }
              if (day.isOutsideMonth) {
                return (
                  <TableRow key={index} className="font-mono text-sm bg-gray-100 hover:bg-muted">
                    <TableCell className="font-medium font-sans whitespace-nowrap">{format(new Date(day.date), "EEE do")}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              }
              if (day.activities && day.activities?.length > 0) {
                return day.activities.map((activity, activityIndex) => (
                  <TableRow
                    key={`${day.date}-${activity.id || activityIndex}`}
                    className={`font-mono text-sm hover:bg-muted/30 cursor-pointer ${
                      activityIndex !== 0 ? "border-t-0" : "" // Remove top border for stacked activities
                    }`}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setOpenDetails(true);
                    }}
                  >
                    <TableCell className="font-medium font-sans whitespace-nowrap align-top">
                      {activityIndex === 0 ? format(new Date(activity.start_time), "EEE do") : ""}
                    </TableCell>

                    <TableCell>
                      <ActivityBadge type={activity.activity_type} />
                    </TableCell>

                    <TableCell>
                      {activity.workout_type === "uncategorized" ? (
                        <Popover
                          open={activePopover === `type-${activity.id}`}
                          onOpenChange={(open) => setActivePopover(open ? `type-${activity.id}` : null)}
                        >
                          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="xs">
                              {loading.update && activePopover === `type-${activity.id}` ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4 text-primary" />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="gap-0 max-w-40">
                            {workoutTypes.map((el, i) => (
                              <div
                                key={i}
                                className="rounded-md py-1 pr-8 pl-1.5 text-sm hover:bg-accent"
                                onClick={() => {
                                  handleUpdateActivity({
                                    workoutType: el,
                                    id: activity.id,
                                    onClose: () => {
                                      setActivePopover(null);
                                    },
                                  });
                                }}
                              >
                                {formatWorkoutType(el)}
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      ) : (
                        formatWorkoutType(activity.workout_type)
                      )}
                    </TableCell>

                    <TableCell>
                      <TrainingEffectBadge label={activity.training_effect_label} />
                    </TableCell>

                    <TableCell className="text-right">{formatDistance(activity.distance_meters || 0)}</TableCell>
                    <TableCell className="text-right">{formatDuration(activity.duration_seconds || 0)}</TableCell>
                    <TableCell className="text-right text-primary">
                      {activity.avg_speed_mps ? speedToPaceFormatted(activity.avg_speed_mps) : "-"}
                    </TableCell>
                    <TableCell className="text-right">{formatAvgMaxHR(activity.avg_heart_rate, activity.max_heart_rate)}</TableCell>
                    <TableCell className="text-right">{formatElevation(activity.elevation_gain_meters || 0)}</TableCell>

                    <TableCell className="text-right">
                      {!activity.rpe ? (
                        <Popover
                          open={activePopover === `rpe-${activity.id}`}
                          onOpenChange={(open) => setActivePopover(open ? `rpe-${activity.id}` : null)}
                        >
                          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="xs">
                              {loading.update && activePopover === `rpe-${activity.id}` ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4 text-primary" />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="gap-0 max-w-25">
                            {rpe.map((el, i) => (
                              <div
                                key={i}
                                className="rounded-md py-1 pr-8 pl-1.5 text-sm hover:bg-accent"
                                onClick={() => {
                                  handleUpdateActivity({
                                    rpe: el,
                                    id: activity.id,
                                    onClose: () => {
                                      setActivePopover(null);
                                    },
                                  });
                                }}
                              >
                                {formatRpe(el)}
                              </div>
                            ))}
                          </PopoverContent>
                        </Popover>
                      ) : (
                        formatRpe(activity.rpe)
                      )}
                    </TableCell>

                    <TableCell className="flex justify-center">
                      {activity.notes ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <FileText className="size-4 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p className="text-sm font-normal!">{activity.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Popover
                          open={activePopover === `notes-${activity.id}`}
                          onOpenChange={(open) => setActivePopover(open ? `notes-${activity.id}` : null)}
                        >
                          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="xs">
                              {loading.update && activePopover === `notes-${activity.id}` ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4 text-primary" />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="gap-3">
                            <Textarea placeholder="Add notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                handleUpdateActivity({
                                  notes: notes,
                                  id: activity.id,
                                  onClose: () => {
                                    setActivePopover(null);
                                  },
                                });
                              }}
                            >
                              Save
                            </Button>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                  </TableRow>
                ));
              }
            })}
          </TableBody>
        </Table>
        <ActivityDetailsDialog activity={selectedActivity} open={openDetails} onOpenChange={setOpenDetails} />
        {/* <ActivityDialog activity={selectedActivity} open={openDetails} onOpenChange={setOpenDetails} /> */}
      </div>
      <div className="py-2"></div>
    </div>
  );
}
