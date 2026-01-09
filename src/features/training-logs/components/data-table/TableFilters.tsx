import { useState } from "react";
import { Button } from "@/lib/ui/button";
import { ButtonGroup } from "@/lib/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/lib/ui/dropdown-menu";
import { ArrowDown, ArrowUp, Calendar1, CalendarDays, ChevronDown, Download, Loader2, Plus } from "lucide-react";
import type { CreateActivityParams, LoadingState } from "../../controllers/activity.controller";
import { CreateActivityDialog } from "../activity-dialog/CreateActivityDialog";
import { useFilterActivityStore } from "../../stores/filter-activity.store";
import SyncDatesDialog from "./SyncDatesDialog";

export default function TableFilters({
  garminSync,
  loading,
  createActivity,
}: {
  garminSync: (params?: { startDate?: string; endDate?: string }) => void;
  loading: LoadingState;
  createActivity: (params: CreateActivityParams) => void;
}) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [syncDatesDialogOpen, setSyncDatesDialogOpen] = useState(false);
  const [syncType, setSyncType] = useState("date");
  const { order, setOrder } = useFilterActivityStore();

  const handleSyncWithDates = (params: { startDate: string; endDate: string }) => {
    garminSync(params);
    setSyncDatesDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <ButtonGroup>
          <Button variant="outline" size="sm" className={`${order === "asc" && "bg-muted"}`} onClick={() => setOrder("asc")}>
            Asc
            <ArrowUp className="size-3" />
          </Button>
          <Button variant="outline" size="sm" className={`${order === "desc" && "bg-muted"}`} onClick={() => setOrder("desc")}>
            Desc
            <ArrowDown className="size-3" />
          </Button>
        </ButtonGroup>

        <div className="flex items-center gap-2">
          <div className="flex">
            <Button variant="outline" size="sm" className="rounded-r-none border-r-0" onClick={() => garminSync()}>
              <img src="/garmin.png" alt="Garmin" className="size-4 rounded" />
              Sync with Garmin
              {loading?.syncGarmin && <Loader2 className="animate-spin h-4 w-4 ml-1" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-l-none px-2">
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-w-xs! w-full">
                <DropdownMenuItem onClick={() => garminSync()}>
                  <Download className="size-4 mr-1" />
                  Sync all activities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    setSyncDatesDialogOpen(true);
                    setSyncType("date");
                  }}
                >
                  <Calendar1 className="size-4 mr-1" />
                  Select day
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setSyncDatesDialogOpen(true);
                    setSyncType("range");
                  }}
                >
                  <CalendarDays className="size-4 mr-1" />
                  Select date range
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="outline" size="sm">
            <img src="https://www.strava.com/favicon.ico" alt="Strava" className="size-4 rounded" />
            Sync with Strava
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="size-4" />
            Create Activity
          </Button>
        </div>
      </div>
      <SyncDatesDialog
        open={syncDatesDialogOpen}
        onOpenChange={setSyncDatesDialogOpen}
        loading={loading?.syncGarmin}
        onSync={handleSyncWithDates}
        type={syncType}
        setType={setSyncType}
      />
      <CreateActivityDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={createActivity} loading={loading?.create} />
    </>
  );
}
