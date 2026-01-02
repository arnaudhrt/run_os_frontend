import { useMemo } from "react";
import TimelineCanvas from "../components/TimelineCanvas";
import TimelineHeader from "../components/TimelineHeader";
import { useRaceController } from "../controllers/race.controller";
import { useTrainingCycleController } from "../controllers/training-cycle.controller";

export default function HorizonPage() {
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const { races, handleCreateRace, loading: raceLoading } = useRaceController();
  const { handleCreateTrainingCycle, loading: trainingCycleLoading } = useTrainingCycleController(currentYear);

  return (
    <section className="p-8">
      <TimelineHeader />
      <div className="mt-12">
        <TimelineCanvas
          races={races || []}
          phases={[]}
          today={today}
          onCreateRace={handleCreateRace}
          onCreateTrainingCycle={handleCreateTrainingCycle}
          raceLoading={raceLoading}
          trainingCycleLoading={trainingCycleLoading}
          currentYear={currentYear}
        />
      </div>
    </section>
  );
}
