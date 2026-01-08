import { TableCell, TableRow } from "@/lib/ui/table";
import { formatDistance, formatDuration, formatElevation, formatWorkoutType, formatAvgMaxHR, formatRpe, renderPace } from "../../utils/format";
import type { ActivityModel, DayEntry } from "../../models/activity.model";
import { format } from "date-fns";
import { ActivityBadge } from "./../data-table/ActivityBadge";
import { FileText, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/lib/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { rpe, runningWorkoutTypes, strengthWorkoutTypes } from "@/lib/types/type";
import { Textarea } from "@/lib/ui/textarea";
import type { UpdateActivityParams } from "../../controllers/activity.controller";

export default function ActivityTableRow({
  activity,
  day,
  index,
  loading,
  setOpenActivityDialog,
  handleUpdateActivity,
}: {
  activity: ActivityModel;
  day: DayEntry;
  index: number;
  loading: boolean;
  setOpenActivityDialog: (activity: ActivityModel | null) => void;
  handleUpdateActivity: (params: UpdateActivityParams) => Promise<void>;
}) {
  const [notes, setNotes] = useState<string>("");
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const workoutTypeOptions = activity.activity_type === "run" ? runningWorkoutTypes : strengthWorkoutTypes;
  return (
    <TableRow
      key={`${day.date}-${activity.id || index}`}
      className={`font-mono text-sm hover:bg-muted/30 cursor-pointer ${
        index !== 0 ? "border-t-0" : "" // Remove top border for stacked activities
      }`}
      onClick={() => setOpenActivityDialog(activity)}
    >
      <TableCell className="font-medium font-sans whitespace-nowrap align-top">
        {index === 0 ? format(new Date(activity.start_time), "EEE do") : ""}
      </TableCell>

      <TableCell>
        <ActivityBadge type={activity.activity_type} />
      </TableCell>

      <TableCell>
        {!activity.workout_type ? (
          <Popover open={activePopover === `type-${activity.id}`} onOpenChange={(open) => setActivePopover(open ? `type-${activity.id}` : null)}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="xs">
                {loading && activePopover === `type-${activity.id}` ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 text-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="gap-0 max-w-40">
              {workoutTypeOptions.map((el, i) => (
                <div
                  key={i}
                  className="rounded-md py-1 pr-8 pl-1.5 text-sm hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
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

      <TableCell className="text-right">{formatDistance(activity.distance_meters || 0)}</TableCell>
      <TableCell className="text-right">{formatDuration(activity.duration_seconds || 0)}</TableCell>
      <TableCell className="text-right text-primary">{renderPace(activity.distance_meters, activity.duration_seconds)}</TableCell>
      <TableCell className="text-right">{formatAvgMaxHR(activity.avg_heart_rate, activity.max_heart_rate)}</TableCell>
      <TableCell className="text-right">{formatElevation(activity.elevation_gain_meters)}</TableCell>

      <TableCell className="text-right">
        {!activity.rpe ? (
          <Popover open={activePopover === `rpe-${activity.id}`} onOpenChange={(open) => setActivePopover(open ? `rpe-${activity.id}` : null)}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="xs">
                {loading && activePopover === `rpe-${activity.id}` ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 text-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="gap-0 max-w-[150px]">
              {rpe.map((el, i) => (
                <div
                  key={i}
                  className="rounded-md py-1 pr-8 pl-1.5 text-sm hover:bg-accent cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateActivity({
                      rpe: el,
                      id: activity.id,
                      onClose: () => {
                        setActivePopover(null);
                      },
                    });
                  }}
                >
                  <span className="text-sm">{formatRpe(el)}</span>
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
          <Popover>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <FileText className="size-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="max-w-sm">
              <p className="text-sm font-normal!">{activity.notes}</p>
            </PopoverContent>
          </Popover>
        ) : (
          <Popover open={activePopover === `notes-${activity.id}`} onOpenChange={(open) => setActivePopover(open ? `notes-${activity.id}` : null)}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="xs">
                {loading && activePopover === `notes-${activity.id}` ? (
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
                onClick={(e) => {
                  e.stopPropagation();
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
  );
}
