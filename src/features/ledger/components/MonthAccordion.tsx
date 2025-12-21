import { AccordionContent, AccordionItem, AccordionTrigger } from "@/lib/ui/accordion";
import { formatDistance, formatDuration, formatElevation } from "../utils/format";
import type { ActivityModel, MonthEntry } from "../models/activity.model";
import ActivityTable from "./ActivityTable";
import { Map, Mountain, Timer } from "lucide-react";
import { format } from "date-fns";

export default function MonthAccordion({ monthEntry }: { monthEntry: MonthEntry }) {
  if (!monthEntry.weeks) return null;

  return (
    <AccordionItem value={monthEntry.monthName} className="border-b-2 last:border-b-0">
      <AccordionTrigger className="hover:no-underline py-4 items-center">
        <div className="flex flex-1 items-center justify-between pr-4 hover:underline cursor-pointer">
          <span className="text-xl font-bold">{monthEntry.monthName}</span>
          <div className="flex gap-6 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-1">
              <Map className="size-4" />
              <span>{formatDistance(monthEntry.totals.distance_meters)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="size-4" />
              <span className="hidden md:inline">{formatDuration(monthEntry.totals.duration_seconds)}</span>
            </div>
            {monthEntry.totals.elevation_gain_meters && monthEntry.totals.elevation_gain_meters > 0 && (
              <div className="flex items-center gap-1">
                <Mountain className="size-4" />
                <span className="hidden md:inline">{formatElevation(monthEntry.totals.elevation_gain_meters)}</span>
              </div>
            )}

            <span className="text-primary font-bold">{monthEntry.totals.activitiesCount} Activities</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-2 pb-6">
          {monthEntry.weeks.map((week, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Week {week.weekNumber} ({format(week.startDate, "EEE do")} → {format(week.endDate, "EEE do")})
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <ActivityTable activities={week.days?.map((d) => d.activity).filter(Boolean) as ActivityModel[]} />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
