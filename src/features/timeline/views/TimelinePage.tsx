import TimelineCanvas from "../components/TimelineCanvas";
import TimelineHeader from "../components/TimelineHeader";
import type { RaceModel } from "../models/race.model";
import type { PhaseModel } from "../models/phase.model";

const mockRaces: RaceModel[] = [
  {
    id: "1",
    user_id: "user1",
    name: "Paris Marathon",
    race_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    race_type: "marathon",
    priority: 1,
    is_completed: false,
    distance_meters: 42195,
    location: "Paris, France",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    name: "Trail des Monts",
    race_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
    race_type: "trail",
    priority: 2,
    is_completed: false,
    distance_meters: 25000,
    elevation_gain_meters: 1200,
    location: "Alps, France",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user1",
    name: "Local 10K",
    race_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    race_type: "run",
    priority: 3,
    is_completed: false,
    distance_meters: 10000,
    location: "City Park",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "user1",
    name: "Half Marathon",
    race_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    race_type: "half_marathon",
    priority: 2,
    is_completed: true,
    distance_meters: 21097,
    result_time_seconds: 5400,
    location: "Downtown",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockPhases: PhaseModel[] = [
  {
    id: "1",
    user_id: "user1",
    phase_type: "base",
    start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // Started 60 days ago
    end_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // Ended 20 days ago
    description: "Building aerobic base",
    weekly_volume_target_km: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user1",
    phase_type: "build",
    start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // Started 20 days ago
    end_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 25 days
    description: "Increasing intensity",
    weekly_volume_target_km: 65,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user1",
    phase_type: "peak",
    start_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 25 days
    end_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 50 days
    description: "Race-specific training",
    weekly_volume_target_km: 70,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "user1",
    phase_type: "taper",
    start_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 50 days
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 60 days (race day)
    description: "Pre-race taper",
    weekly_volume_target_km: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "user1",
    phase_type: "recovery",
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Starts after race
    end_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks recovery
    description: "Post-marathon recovery",
    weekly_volume_target_km: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function HorizonPage() {
  return (
    <section className="p-8">
      <TimelineHeader />
      <div className="mt-12">
        <TimelineCanvas races={mockRaces} phases={mockPhases} />
      </div>
    </section>
  );
}
