import { useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import type { PlannedWorkoutModel, TimeSlot } from "../models/planned-workout.model";
import {
  createPlannedWorkout,
  deletePlannedWorkout,
  getPlannedWorkoutById,
  getPlannedWorkoutsByDateRange,
  updatePlannedWorkout,
} from "../data/planned-workout.data";
import { validateCreatePlannedWorkoutFields, validateUpdatePlannedWorkoutFields } from "../validations/planned-workout.validation";
import type { ActivityType, WorkoutType } from "@/lib/types/type";

export interface CreatePlannedWorkoutParams {
  plannedDate: string;
  timeSlot: TimeSlot;
  activityType: ActivityType;
  workoutType?: WorkoutType;
  targetDistanceMeters?: number | null;
  targetDurationSeconds?: number | null;
  description?: string | null;
  activityId?: string | null;
  onClose: () => void;
}

export type UpdatePlannedWorkoutParams = {
  id: string;
  plannedDate?: string;
  timeSlot?: TimeSlot;
  activityType?: ActivityType;
  workoutType?: WorkoutType;
  targetDistanceMeters?: number | null;
  targetDurationSeconds?: number | null;
  description?: string | null;
  activityId?: string | null;
  onClose: () => void;
};

export interface PlannedWorkoutLoadingState {
  get: boolean;
  getByDateRange: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export const usePlannedWorkoutController = (startDate: string, endDate: string) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkoutModel[]>([]);
  const [plannedWorkout, setPlannedWorkout] = useState<PlannedWorkoutModel | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<PlannedWorkoutLoadingState>({
    get: false,
    getByDateRange: false,
    create: false,
    update: false,
    delete: false,
  });

  const handleFetchByDateRange = async (): Promise<PlannedWorkoutModel[]> => {
    setLoading((prev) => ({ ...prev, getByDateRange: true }));
    setApiError(null);

    try {
      const token = await getFreshIdToken();
      const workouts = await getPlannedWorkoutsByDateRange({
        startDate,
        endDate,
        token,
      });
      setPlannedWorkouts(workouts);
      return workouts;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, getByDateRange: false }));
    }
  };

  const handleFetchById = async (id: string): Promise<PlannedWorkoutModel | null> => {
    setLoading((prev) => ({ ...prev, get: true }));
    setApiError(null);

    if (!id || id.trim() === "") {
      setValidationErrors({ id: "Workout id is required" });
      setLoading((prev) => ({ ...prev, get: false }));
      return null;
    }

    try {
      const token = await getFreshIdToken();
      const workout = await getPlannedWorkoutById({ id, token });
      setPlannedWorkout(workout);
      return workout;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  };

  const handleCreate = async ({
    plannedDate,
    timeSlot,
    activityType,
    workoutType,
    targetDistanceMeters,
    targetDurationSeconds,
    description,
    activityId,
    onClose,
  }: CreatePlannedWorkoutParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setValidationErrors(null);
    setApiError(null);

    const { success, errors, data } = validateCreatePlannedWorkoutFields({
      plannedDate,
      timeSlot,
      activityType,
      workoutType,
      targetDistanceMeters,
      targetDurationSeconds,
      description,
      activityId,
    });

    if (!success || !data) {
      setValidationErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      const body = {
        planned_date: data.plannedDate,
        time_slot: data.timeSlot,
        activity_type: data.activityType,
        ...(data.workoutType ? { workout_type: data.workoutType } : {}),
        ...(data.targetDistanceMeters ? { target_distance_meters: data.targetDistanceMeters } : {}),
        ...(data.targetDurationSeconds ? { target_duration_seconds: data.targetDurationSeconds } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.activityId ? { activity_id: data.activityId } : {}),
      };

      await createPlannedWorkout({ body, token });
      toast.success("Workout created successfully");
      await handleFetchByDateRange();

      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleUpdate = async ({
    id,
    plannedDate,
    timeSlot,
    activityType,
    workoutType,
    targetDistanceMeters,
    targetDurationSeconds,
    description,
    activityId,
    onClose,
  }: UpdatePlannedWorkoutParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, update: true }));
    setValidationErrors(null);
    setApiError(null);

    const { success, errors, data } = validateUpdatePlannedWorkoutFields({
      id,
      plannedDate,
      timeSlot,
      activityType,
      workoutType,
      targetDistanceMeters,
      targetDurationSeconds,
      description,
      activityId,
    });

    if (!success || !data) {
      setValidationErrors(errors);
      setLoading((prev) => ({ ...prev, update: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      const body = {
        ...(data.plannedDate !== undefined && { planned_date: data.plannedDate }),
        ...(data.timeSlot !== undefined && { time_slot: data.timeSlot }),
        ...(data.activityType !== undefined && { activity_type: data.activityType }),
        ...(data.workoutType !== undefined && { workout_type: data.workoutType }),
        ...(data.targetDistanceMeters !== undefined && { target_distance_meters: data.targetDistanceMeters }),
        ...(data.targetDurationSeconds !== undefined && { target_duration_seconds: data.targetDurationSeconds }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.activityId !== undefined && { activity_id: data.activityId }),
      };

      await updatePlannedWorkout({ id: data.id, body, token });
      toast.success("Workout updated successfully");

      await handleFetchByDateRange();

      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleDelete = async ({ id, onClose }: { id: string; onClose: () => void }): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setValidationErrors(null);
    setApiError(null);

    if (!id || id.trim() === "") {
      setValidationErrors({ id: "Workout id is required" });
      setLoading((prev) => ({ ...prev, delete: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      await deletePlannedWorkout({ id, token });
      toast.success("Workout deleted successfully");
      await handleFetchByDateRange();

      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return {
    // State
    plannedWorkouts,
    plannedWorkout,
    validationErrors,
    apiError,
    loading,
    // Actions
    handleFetchByDateRange,
    handleFetchById,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
