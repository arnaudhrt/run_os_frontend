import { StatsSummary } from "../components/StatsBloc";
import TableFilters from "../components/TableFilters";
import YearSection from "../components/YearSection";
import { useLedgerController } from "../controllers/ledger.controller";

export default function Ledger() {
  const { handleSyncGarmin, loading, structuredActivitiesLog } = useLedgerController();
  if (!structuredActivitiesLog) {
    return <div>Loading...</div>;
  }
  console.log(structuredActivitiesLog);
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <header className="flex justify-between items-center pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Ledger</h1>
          <p className="text-muted-foreground">Historical activity log and weekly reviews.</p>
        </div>
        <StatsSummary
          isLifetime={true}
          distance={structuredActivitiesLog.totals.distance_meters}
          duration={structuredActivitiesLog.totals.duration_seconds}
          elevation={structuredActivitiesLog.totals.elevation_gain_meters}
          raceCount={structuredActivitiesLog.totals.activitiesCount}
          className="bg-slate-50/50"
        />
      </header>
      <TableFilters garminSync={handleSyncGarmin} loading={loading} />
      {structuredActivitiesLog.years.map((year) => (
        <YearSection key={year.year} yearEntry={year} />
      ))}
    </div>
  );
}
