import type { YearEntry } from "../models/activity.model";
import { StatsSummary } from "./StatsBloc";
import { Accordion } from "@/lib/ui/accordion";
import MonthAccordion from "./MonthAccordion";

export default function YearSection({ yearEntry }: { yearEntry: YearEntry }) {
  if (!yearEntry.months) return null;

  return (
    <div className="border rounded-lg">
      <div className="bg-muted/30 p-5 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-4xl font-black">{yearEntry.year}</h2>
          <StatsSummary
            distance={yearEntry.totals.distance_meters}
            duration={yearEntry.totals.duration_seconds}
            elevation={yearEntry.totals.elevation_gain_meters}
            raceCount={yearEntry.totals.activitiesCount} // Assuming you filter by workout_type === 'race'
          />
        </div>
      </div>
      <div className="p-5">
        <Accordion type="multiple" className="w-full">
          {yearEntry.months.map((month) => (
            <MonthAccordion key={`${yearEntry.year}-${month.month}`} monthEntry={month} />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
