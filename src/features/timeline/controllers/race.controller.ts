import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import type { RaceModel } from "../models/race.model";
import { getFreshIdToken } from "@/lib/firebase/token";
import { createRace, deleteRace, getRaceById, getRaces, updateRace } from "../data/race.data";
import type { RaceType } from "@/lib/types/type";
import { validateCreateRaceFields, validateUpdateRaceFields } from "../validations/race.validation";

export interface RaceLoadingState {
  get: boolean;
  getAll: boolean;
  update: boolean;
  create: boolean;
  delete: boolean;
}

export interface CreateRaceParams {
  name: string;
  raceDate: Date;
  raceType: RaceType;
  priority: 1 | 2 | 3;
  isCompleted: boolean;
  elevation?: number;
  distance?: number;
  targetTime?: number;
  location?: string;
  notes?: string;
  resultTime?: number;
  resultPlaceOverall?: number;
  resultPlaceGender?: number;
  resultPlaceCategory?: number;
  categoryName?: string;
  onClose: () => void;
}

export interface UpdateRaceParams {
  id: string;
  name?: string;
  raceDate?: string;
  raceType?: RaceType;
  priority?: 1 | 2 | 3;
  isCompleted?: boolean;
  elevation?: number;
  distance?: number;
  targetTime?: number;
  location?: string;
  notes?: string;
  resultTime?: number;
  resultPlaceOverall?: number;
  resultPlaceGender?: number;
  resultPlaceCategory?: number;
  categoryName?: string;
  onClose: () => void;
}

export const useRaceController = () => {
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [races, setRaces] = useState<RaceModel[] | null>(null);
  const [race, setRace] = useState<RaceModel | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<RaceLoadingState>({
    create: false,
    delete: false,
    get: false,
    getAll: false,
    update: false,
  });

  const handleFetchAllRaces = async (): Promise<RaceModel[] | null> => {
    setLoading((prev) => ({ ...prev, getAll: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      const data = await getRaces({ token });
      setRaces(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, recommendation: false }));
    }
  };

  const handleFetchRaceById = async (id: string): Promise<RaceModel | null> => {
    setLoading((prev) => ({ ...prev, getAll: true }));
    setApiError(null);
    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Race id is required" });
    }
    try {
      const token = await getFreshIdToken();
      const data = await getRaceById({ id, token });
      setRace(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, recommendation: false }));
    }
  };

  const handleCreateRace = async ({
    name,
    raceDate,
    raceType,
    priority,
    isCompleted = false,
    elevation,
    distance,
    targetTime,
    location,
    resultTime,
    resultPlaceOverall,
    resultPlaceGender,
    resultPlaceCategory,
    categoryName,
    notes,
    onClose,
  }: CreateRaceParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateCreateRaceFields({
      name,
      raceDate,
      raceType,
      priority,
      isCompleted,
      elevation,
      distance,
      targetTime,
      location,
      resultTime,
      resultPlaceOverall,
      resultPlaceGender,
      resultPlaceCategory,
      categoryName,
      notes,
    });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        name,
        race_date: data.raceDate.toDateString(),
        distance_meters: Math.round(data.distance),
        race_type: data.raceType,
        priority: data.priority,
        is_completed: data.isCompleted,
        ...(elevation ? { elevation_gain_meters: data.elevation } : {}),
        ...(targetTime ? { target_time_seconds: data.targetTime } : {}),
        ...(location ? { location: data.location } : {}),
        ...(notes ? { notes: data.notes } : {}),
        ...(resultTime ? { result_time_seconds: data.resultTime } : {}),
        ...(resultPlaceOverall ? { result_place_overall: data.resultPlaceOverall } : {}),
        ...(resultPlaceGender ? { result_place_gender: data.resultPlaceGender } : {}),
        ...(resultPlaceCategory ? { result_place_category: data.resultPlaceCategory } : {}),
        ...(categoryName ? { category_name: data.categoryName } : {}),
      };
      await createRace({ body, token });
      toast.success("Race created successfully");
      await handleFetchAllRaces();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleUpdateRace = async ({
    id,
    name,
    raceDate,
    raceType,
    priority,
    isCompleted,
    elevation,
    distance,
    targetTime,
    location,
    notes,
    resultTime,
    resultPlaceOverall,
    resultPlaceGender,
    resultPlaceCategory,
    categoryName,
    onClose,
  }: UpdateRaceParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, update: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateUpdateRaceFields({
      id,
      name,
      raceDate,
      raceType,
      priority,
      isCompleted,
      elevation,
      distance,
      targetTime,
      location,
      notes,
      resultTime,
      resultPlaceOverall,
      resultPlaceGender,
      resultPlaceCategory,
      categoryName,
    });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, update: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        ...(data.name ? { name: data.name } : {}),
        ...(data.raceDate ? { race_date: data.raceDate } : {}),
        ...(data.distance ? { distance_meters: data.distance } : {}),
        ...(data.elevation ? { elevation_gain_meters: data.elevation } : {}),
        ...(data.targetTime ? { target_time_seconds: data.targetTime } : {}),
        ...(data.location ? { location: data.location } : {}),
        ...(data.notes ? { notes: data.notes } : {}),
        ...(data.raceType ? { race_type: data.raceType } : {}),
        ...(data.priority ? { priority: data.priority } : {}),
        ...(data.isCompleted ? { is_completed: data.isCompleted } : {}),
        ...(data.resultTime ? { result_time_seconds: data.resultTime } : {}),
        ...(data.resultPlaceOverall ? { result_place_overall: data.resultPlaceOverall } : {}),
        ...(data.resultPlaceGender ? { result_place_gender: data.resultPlaceGender } : {}),
        ...(data.resultPlaceCategory ? { result_place_category: data.resultPlaceCategory } : {}),
        ...(data.categoryName ? { category_name: data.categoryName } : {}),
      };
      await updateRace({ id: data.id, body, token });
      toast.success("Race updated successfully");
      await handleFetchAllRaces();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleDeleteRace = async ({ id, onClose }: { id: string; onClose: () => void }): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setValidationsErrors(null);
    setApiError(null);

    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Race id is required" });
      setLoading((prev) => ({ ...prev, delete: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      await deleteRace({ id, token });
      toast.success("Race deleted successfully");
      await handleFetchAllRaces();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    handleFetchAllRaces();
  }, []);

  return {
    handleFetchAllRaces,
    handleFetchRaceById,
    handleCreateRace,
    handleUpdateRace,
    handleDeleteRace,
    validationsErrors,
    apiError,
    loading,
    races,
    race,
  };
};
