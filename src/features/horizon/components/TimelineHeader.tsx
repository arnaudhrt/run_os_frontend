import { Button } from "@/lib/ui/button";
import { Flag, Target } from "lucide-react";

export default function TimelineHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold mb-1">Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Detailed, visual representation of your running journey, highlighting races, training phases, weekly volume and elevation targets.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">
          <Target className="size-4" />
          Create training phase
        </Button>
        <Button>
          <Flag className="size-4" />
          Create race
        </Button>
      </div>
    </div>
  );
}
