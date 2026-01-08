import { useState } from "react";
import { Button } from "@/lib/ui/button";
import { ButtonGroup } from "@/lib/ui/button-group";
import { ArrowDown, ArrowUp, Loader2, Plus } from "lucide-react";
import type { CreateActivityParams, LoadingState } from "../../controllers/activity.controller";
import { CreateActivityDialog } from "../activity-dialog/CreateActivityDialog";
import { useFilterActivityStore } from "../../stores/filter-activity.store";

export default function TableFilters({
  garminSync,
  loading,
  createActivity,
}: {
  garminSync: () => void;
  loading: LoadingState;
  createActivity: (params: CreateActivityParams) => void;
}) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { order, setOrder } = useFilterActivityStore();

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

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => garminSync()}>
            <img src="/garmin.png" alt="Garmin" className="size-4 rounded" />
            Sync with Garmin
            {loading?.syncGarmin && <Loader2 className="animate-spin h-4 w-4 ml-1" />}
          </Button>
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

      <CreateActivityDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={createActivity} loading={loading?.create} />
    </>
  );
}
