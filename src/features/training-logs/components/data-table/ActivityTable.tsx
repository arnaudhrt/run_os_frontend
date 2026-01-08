import { Table, TableBody } from "@/lib/ui/table";
import { formatDistance, formatDuration, formatElevation } from "../../utils/format";
import type { ActivityModel, DayEntry, WeekEntry } from "../../models/activity.model";
import { Mountain, Timer, Map } from "lucide-react";
import { ActivityDetailDialog } from "../activity-dialog/ActivityDetailDialog";
import { useState } from "react";
import type { LoadingState, UpdateActivityParams, ValidationErrors } from "../../controllers/activity.controller";
import ActivityTableRow from "./ActivityTableRow";
import TableHeaderBloc from "./ActivityTableHeader";
import RestDayTableRow from "./RestDayTableRow";

export default function ActivityTable({
  week,
  days,
  handleUpdateActivity,
  handleDeleteActivity,
  loading,
  validationErrors,
}: {
  week: WeekEntry | null;
  days: DayEntry[];
  handleUpdateActivity: (params: UpdateActivityParams) => Promise<void>;
  handleDeleteActivity: (activityId: string, onClose: () => void) => Promise<void>;
  loading: LoadingState;
  validationErrors: ValidationErrors;
}) {
  const [openActivityDialog, setOpenActivityDialog] = useState<ActivityModel | null>(null);

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
          <TableHeaderBloc />
          <TableBody>
            {days.map((day, index) => {
              if (day.isRestDay) {
                return <RestDayTableRow index={index} date={day.date} />;
              }
              if (day.activities && day.activities?.length > 0) {
                return day.activities.map((activity, activityIndex) => (
                  <ActivityTableRow
                    activity={activity}
                    day={day}
                    index={activityIndex}
                    setOpenActivityDialog={setOpenActivityDialog}
                    handleUpdateActivity={handleUpdateActivity}
                    loading={loading.update}
                  />
                ));
              }
            })}
          </TableBody>
        </Table>
        <ActivityDetailDialog
          activity={openActivityDialog}
          open={openActivityDialog !== null}
          onOpenChange={setOpenActivityDialog}
          deleteActivity={handleDeleteActivity}
          updateActivity={handleUpdateActivity}
          loading={loading}
          validationErrors={validationErrors}
        />
      </div>
      <div className="py-2"></div>
    </div>
  );
}
