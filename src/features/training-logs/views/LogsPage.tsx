import LoaderScreen from "@/lib/components/LoaderScreen";
import { StatsSummary } from "../components/StatsBloc";
import TableFilters from "../components/data-table/TableFilters";
import YearSection from "../components/YearSection";
import { useActivityController } from "../controllers/activity.controller";

export default function Ledger() {
  const { handleSyncGarmin, loading, structuredActivitiesLog, handleUpdateActivity, handleCreateActivity, handleDeleteActivity, validationsErrors } =
    useActivityController();
  if (!structuredActivitiesLog) {
    return <LoaderScreen />;
  }
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <header className="flex justify-between items-center pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training Logs</h1>
          <p className="text-muted-foreground">Historical activity log and weekly reviews.</p>
        </div>
        <StatsSummary
          isLifetime={true}
          distance={structuredActivitiesLog.totals.distance_meters}
          duration={structuredActivitiesLog.totals.duration_seconds}
          elevation={structuredActivitiesLog.totals.elevation_gain_meters}
          raceCount={structuredActivitiesLog.totals.races_count}
          className="bg-slate-50/50"
        />
      </header>
      <TableFilters garminSync={handleSyncGarmin} loading={loading} createActivity={handleCreateActivity} />
      <div className="space-y-4">
        {structuredActivitiesLog.years.map((year) => (
          <YearSection
            key={year.year}
            yearEntry={year}
            handleUpdateActivity={handleUpdateActivity}
            loading={loading}
            handleDeleteActivity={handleDeleteActivity}
            validationErrors={validationsErrors}
          />
        ))}
      </div>
    </div>
  );
}
