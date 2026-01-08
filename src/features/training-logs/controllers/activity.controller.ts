import type { ActivityModel, StructuredActivitiesLog } from "../models/activity.model";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import { createActivity, deleteActivity, getAllActivities, syncGarmin, updateActivity } from "../data/activity.data";
import type { ActivityType, WorkoutType } from "@/lib/types/type";
import { validateCreateActivityFields, validateUpdateActivityFields } from "../validations/activity.validation";
import { structureActivitiesLog } from "../utils/format";

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
  avgTemperatureCelsius?: number;
  isPr?: boolean;
  hasPain?: string;
  rpe?: number;
  notes?: string;
  shoesId?: string;
  resetForm: () => void;
}

export interface UpdateActivityParams {
  id: string;
  activityType?: ActivityType;
  workoutType?: WorkoutType;
  distanceMeters?: number;
  durationSeconds?: number;
  elevationGainMeters?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgTemperatureCelsius?: number;
  isPr?: boolean;
  hasPain?: string;
  rpe?: number;
  notes?: string;
  shoesId?: string;
  onClose: () => void;
}

export type ValidationErrors = Record<string, string> | null;

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
      await handleFetchAllActivities();
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

  const handleUpdateActivity = async ({
    id,
    activityType,
    workoutType,
    distanceMeters,
    durationSeconds,
    elevationGainMeters,
    avgHeartRate,
    maxHeartRate,
    avgTemperatureCelsius,
    isPr,
    hasPain,
    rpe,
    notes,
    shoesId,
    onClose,
  }: UpdateActivityParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, update: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateUpdateActivityFields({
      id,
      activityType,
      workoutType,
      distanceMeters,
      durationSeconds,
      elevationGainMeters,
      avgHeartRate,
      maxHeartRate,
      avgTemperatureCelsius,
      isPr,
      hasPain,
      rpe,
      notes,
      shoesId,
    });

    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, update: false }));
      if (errors) {
        const errorMessages = Object.entries(errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      }
      return;
    }

    try {
      const token = await getFreshIdToken();
      const body = {
        ...(data.activityType && { activity_type: data.activityType }),
        ...(data.workoutType && { workout_type: data.workoutType }),
        ...(data.distanceMeters && { distance_meters: data.distanceMeters }),
        ...(data.durationSeconds && { duration_seconds: data.durationSeconds }),
        ...(data.elevationGainMeters && { elevation_gain_meters: data.elevationGainMeters }),
        ...(data.avgHeartRate && { avg_heart_rate: data.avgHeartRate }),
        ...(data.maxHeartRate && { max_heart_rate: data.maxHeartRate }),
        ...(data.avgTemperatureCelsius !== undefined && { avg_temperature_celsius: data.avgTemperatureCelsius }),
        ...(data.isPr !== undefined && { is_pr: data.isPr }),
        ...(data.hasPain !== undefined && { has_pain: data.hasPain }),
        ...(data.rpe && { rpe: data.rpe }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.shoesId && { shoes_id: data.shoesId }),
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
    avgTemperatureCelsius,
    isPr,
    hasPain,
    rpe,
    notes,
    shoesId,
    resetForm,
  }: CreateActivityParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setApiError(null);
    setValidationsErrors(null);

    const { success, errors, data } = validateCreateActivityFields({
      activityType,
      workoutType,
      startTime,
      distanceMeters,
      durationSeconds,
      elevationGainMeters,
      avgHeartRate,
      maxHeartRate,
      avgTemperatureCelsius,
      isPr,
      hasPain,
      rpe,
      notes,
      shoesId,
    });

    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      const body = {
        activity_type: data.activityType,
        workout_type: data.workoutType,
        start_time: data.startTime,
        source: "manual" as const,
        is_pr: data.isPr ? true : false,
        ...(data.distanceMeters && { distance_meters: data.distanceMeters }),
        ...(data.durationSeconds && { duration_seconds: data.durationSeconds }),
        ...(data.elevationGainMeters && { elevation_gain_meters: data.elevationGainMeters }),
        ...(data.avgHeartRate && { avg_heart_rate: data.avgHeartRate }),
        ...(data.maxHeartRate && { max_heart_rate: data.maxHeartRate }),
        ...(data.avgTemperatureCelsius !== undefined && { avg_temperature_celsius: data.avgTemperatureCelsius }),
        ...(data.hasPain !== undefined && { has_pain: data.hasPain }),
        ...(data.rpe && { rpe: data.rpe }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.shoesId && { shoes_id: data.shoesId }),
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

  const handleDeleteActivity = async (id: string, onClose: () => void): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setApiError(null);

    if (!id || id.trim() === "") {
      toast.error("Please select an activity to delete");
      setLoading((prev) => ({ ...prev, delete: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      await deleteActivity({ id, token });
      onClose();
      toast.success("Activity deleted successfully");
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
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
