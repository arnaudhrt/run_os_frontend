import type { ActivityModel, StructuredActivitiesLog } from "./../models/activity.model";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import { getAllActivities, syncGarmin, updateActivity } from "../data/ledger.data";
import type { RPE, WorkoutType } from "@/lib/types/type";
import { validateUpdateActivityFields } from "../validations/activity.validation";
import { structureActivitiesLog } from "../utils/format";

export interface LoadingState {
  syncGarmin: boolean;
  getAll: boolean;
  update: boolean;
}

export interface DateRange {
  minDate: string | null;
  maxDate: string | null;
}

export interface UpdateActivityParams {
  id: string;
  rpe?: RPE;
  notes?: string;
  workoutType?: WorkoutType;
  onClose: () => void;
}

export const useLedgerController = () => {
  const [structuredActivitiesLog, setStructuredActivitiesLog] = useState<StructuredActivitiesLog | null>(null);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ minDate: null, maxDate: null });
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    syncGarmin: false,
    getAll: false,
    update: false,
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
    handleUpdateActivity,
    structuredActivitiesLog,
    validationsErrors,
    apiError,
    loading,
  };
};
