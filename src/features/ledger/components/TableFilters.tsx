import { Button } from "@/lib/ui/button";
import { ButtonGroup } from "@/lib/ui/button-group";
import { ArrowDown, ArrowUp, Loader2, Plus } from "lucide-react";
import type { LoadingState } from "../controllers/ledger.controller";

export default function TableFilters({ garminSync, loading }: { garminSync: () => void; loading: LoadingState }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Asc
          <ArrowUp className="size-3" />
        </Button>
        <Button variant="outline" size="sm">
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
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          Create activity
        </Button>
      </div>
    </div>
  );
}
