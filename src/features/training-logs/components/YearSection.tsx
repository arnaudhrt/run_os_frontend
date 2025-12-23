import type { YearEntry } from "../models/activity.model";
import { StatsSummary } from "./StatsBloc";
import { Accordion } from "@/lib/ui/accordion";
import MonthAccordion from "./MonthAccordion";
import type { LoadingState, UpdateActivityParams } from "../controllers/activity.controller";

export default function YearSection({
  yearEntry,
  handleUpdateActivity,
  loading,
}: {
  yearEntry: YearEntry;
  handleUpdateActivity: (params: UpdateActivityParams) => void;
  loading: LoadingState;
}) {
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
            raceCount={yearEntry.totals.races_count} // Assuming you filter by workout_type === 'race'
          />
        </div>
      </div>
      <div className="p-5">
        <Accordion type="multiple" className="w-full">
          {yearEntry.months.map((month) => (
            <MonthAccordion
              key={`${yearEntry.year}-${month.month}`}
              monthEntry={month}
              handleUpdateActivity={handleUpdateActivity}
              loading={loading}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
