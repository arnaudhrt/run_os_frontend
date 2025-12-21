import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/ui/table";
import { formatDistance, formatDuration, formatPace, formatElevation, formatWorkoutType, formatAvgMaxHR } from "../utils/format";
import type { ActivityModel } from "../models/activity.model";
import { format } from "date-fns";
import { ActivityBadge } from "./ActivityBadge";
import { FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { ActivityDetailsDialog } from "./ActivityDetailsDialog";
import { useState } from "react";

export default function ActivityTable({ activities }: { activities: ActivityModel[] }) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityModel | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 uppercase text-[10px] font-bold tracking-widest">
            <TableHead className="">Date</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Dist</TableHead>
            <TableHead className="text-right">Time</TableHead>
            <TableHead className="text-right">Pace</TableHead>
            <TableHead className="text-right">Avg/Max HR</TableHead>
            <TableHead className="text-right">Elev</TableHead>
            <TableHead className="text-right">RPE</TableHead>
            <TableHead className="text-center">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={activity.id}
              className="font-mono text-sm hover:bg-muted/30"
              onClick={() => {
                setSelectedActivity(activity);
                setOpenDetails(true);
              }}
            >
              <TableCell className="font-medium font-sans whitespace-nowrap">{format(activity.start_time, "EEE do")}</TableCell>
              <TableCell>
                <ActivityBadge type={activity.activity_type} />
              </TableCell>
              <TableCell>
                <span className="font-bold text-foreground">{formatWorkoutType(activity.workout_type)}</span>
              </TableCell>
              <TableCell className="text-right">{formatDistance(activity.distance_meters || 0)}</TableCell>
              <TableCell className="text-right">{formatDuration(activity.duration_seconds || 0)}</TableCell>
              <TableCell className="text-right text-primary">{formatPace(activity.avg_pace_min_per_km)}</TableCell>
              <TableCell className="text-right">{formatAvgMaxHR(activity.avg_heart_rate, activity.max_heart_rate)}</TableCell>
              <TableCell className="text-right">{formatElevation(activity.elevation_gain_meters || 0)}</TableCell>
              <TableCell className="text-right">{activity.rpe}</TableCell>
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
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ActivityDetailsDialog activity={selectedActivity} open={openDetails} onOpenChange={setOpenDetails} />
    </div>
  );
}
