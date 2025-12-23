import type { ActivityModel, StructuredActivitiesLog } from "../models/activity.model";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import { createActivity, deleteActivity, getAllActivities, syncGarmin, updateActivity } from "../data/activity.data";
import type { ActivityType, RPE, WorkoutType } from "@/lib/types/type";
import { validateCreateActivityFields, validateUpdateActivityFields } from "../validations/activity.validation";
import { calculateAvgSpeed, structureActivitiesLog } from "../utils/format";

export interface LoadingState {
  syncGarmin: boolean;
  getAll: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface DateRange {
  minDate: string | null;
  maxDate: string | null;
}

export interface CreateActivityParams {
  activityType: ActivityType;
  workoutType: WorkoutType;
  startTime: string;
  distanceMeters?: number;
  durationSeconds?: number;
  elevationGainMeters?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  calories?: number;
  steps?: number;
  avgTemperatureCelsius?: number;
  isPr?: boolean;
  rpe?: RPE;
  notes?: string;
  resetForm: () => void;
}

export interface UpdateActivityParams {
  id: string;
  rpe?: RPE;
  notes?: string;
  workoutType?: WorkoutType;
  onClose: () => void;
}

export interface DeleteActivityParams {
  id: string;
  onClose: () => void;
}

export const useActivityController = () => {
  const [structuredActivitiesLog, setStructuredActivitiesLog] = useState<StructuredActivitiesLog | null>(null);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ minDate: null, maxDate: null });
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    syncGarmin: false,
    getAll: false,
    create: false,
    update: false,
    delete: false,
  });

  const handleSyncGarmin = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, syncGarmin: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      await syncGarmin({ token });
      toast.success("Garmin synced successfully");
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      toast.error("Failed to sync Garmin");
    } finally {
      setLoading((prev) => ({ ...prev, syncGarmin: false }));
    }
  };

  const handleFetchAllActivities = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, getAll: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      const data = await getAllActivities({ token });
      setActivities(data.activities);
      setDateRange({ minDate: data.min_date, maxDate: data.max_date });
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      toast.error("Failed to fetch all activities");
    } finally {
      setLoading((prev) => ({ ...prev, getAll: false }));
    }
  };

  const handleUpdateActivity = async ({ id, rpe, notes, workoutType, onClose }: UpdateActivityParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, update: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateUpdateActivityFields({ id, rpe, notes, workoutType });

    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, update: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        ...(data.rpe && { rpe: data.rpe }),
        ...(data.notes && { notes: data.notes }),
        ...(data.workoutType && { workout_type: data.workoutType }),
      };
      await updateActivity({ id: data.id, body, token });
      toast.success("Activity updated successfully");
      setActivities((prev) => {
        return prev.map((activity) => (activity.id === data.id ? { ...activity, ...body } : activity));
      });
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleCreateActivity = async ({
    activityType,
    workoutType,
    startTime,
    distanceMeters,
    durationSeconds,
    elevationGainMeters,
    avgHeartRate,
    maxHeartRate,
    avgCadence,
    calories,
    steps,
    avgTemperatureCelsius,
    isPr,
    rpe,
    notes,
    resetForm,
  }: CreateActivityParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setApiError(null);

    const { success, errors, data } = validateCreateActivityFields({
      activityType,
      workoutType,
      startTime,
      distanceMeters,
      durationSeconds,
      elevationGainMeters,
      avgHeartRate,
      maxHeartRate,
      avgCadence,
      calories,
      steps,
      avgTemperatureCelsius,
      isPr,
      rpe,
      notes,
    });

    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }
    let avgSpeed = 0;
    if (data.distanceMeters && data.durationSeconds) {
      avgSpeed = calculateAvgSpeed(data.distanceMeters, data.durationSeconds);
    }

    try {
      const token = await getFreshIdToken();
      const body = {
        activity_type: data.activityType,
        workout_type: data.workoutType,
        start_time: data.startTime,
        source: "manual" as const,
        is_pr: data.isPr ? true : false,
        ...(distanceMeters && { distance_meters: data.distanceMeters }),
        ...(durationSeconds && { duration_seconds: data.durationSeconds }),
        ...(avgSpeed > 0 && { avg_speed_mps: avgSpeed }),
        ...(elevationGainMeters && { elevation_gain_meters: data.elevationGainMeters }),
        ...(avgHeartRate && { avg_heart_rate: data.avgHeartRate }),
        ...(maxHeartRate && { max_heart_rate: data.maxHeartRate }),
        ...(avgCadence && { avg_cadence: data.avgCadence }),
        ...(steps && { steps: data.steps }),
        ...(calories && { calories: data.calories }),
        ...(avgTemperatureCelsius && { avg_temperature_celsius: data.avgTemperatureCelsius }),
        ...(rpe && { rpe }),
        ...(notes && { notes }),
      };
      const newActivity = await createActivity({ body, token });
      toast.success("Activity created successfully");
      setActivities((prev) => [...prev, newActivity]);
      resetForm();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      toast.error("Failed to create activity");
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleDeleteActivity = async ({ id, onClose }: DeleteActivityParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setApiError(null);

    try {
      const token = await getFreshIdToken();
      await deleteActivity({ id, token });
      toast.success("Activity deleted successfully");
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      toast.error("Failed to delete activity");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    handleFetchAllActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 0 && dateRange) {
      const structuredActivities = structureActivitiesLog(activities, dateRange.minDate, dateRange.maxDate);
      setStructuredActivitiesLog(structuredActivities);
    }
  }, [activities, dateRange]);

  return {
    handleFetchAllActivities,
    handleSyncGarmin,
    handleCreateActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    structuredActivitiesLog,
    validationsErrors,
    apiError,
    loading,
  };
};
