import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import type { PhaseType } from "@/lib/types/type";
import { validateCreatePhaseFields } from "../validations/phase.validation";
import type { TrainingCycleModel } from "../models/training-cycle.model";
import { createTrainingCycle, deleteTrainingCycle, getTrainingCycleById, getTrainingCycles } from "../data/training-cycle.data";

export interface TrainingCycleLoadingState {
  get: boolean;
  getAll: boolean;
  update: boolean;
  create: boolean;
  delete: boolean;
}

export interface CreateTrainingCycleParams {
  raceId?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  totalWeeks: number;
  phases: {
    phaseType: PhaseType;
    durationWeeks: number;
  }[];
  onClose: () => void;
}

export const useTrainingCycleController = (year: number) => {
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [trainingCycle, setTrainingCycle] = useState<TrainingCycleModel | null>(null);
  const [trainingCycleList, setTrainingCycleList] = useState<TrainingCycleModel[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<TrainingCycleLoadingState>({
    create: false,
    delete: false,
    get: false,
    getAll: false,
    update: false,
  });

  const handleFetchAllTrainingCycles = async (): Promise<TrainingCycleModel[] | null> => {
    setLoading((prev) => ({ ...prev, getAll: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      const data = await getTrainingCycles({ token, year });
      setTrainingCycleList(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, getAll: false }));
    }
  };

  const handleFetchTrainingCycleById = async (id: string): Promise<TrainingCycleModel | null> => {
    setLoading((prev) => ({ ...prev, get: true }));
    setApiError(null);
    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Training cycle id is required" });
      setLoading((prev) => ({ ...prev, get: false }));
      return null;
    }
    try {
      const token = await getFreshIdToken();
      const data = await getTrainingCycleById({ id, token });
      setTrainingCycle(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  };

  const handleCreateTrainingCycle = async ({
    raceId,
    startDate,
    endDate,
    name,
    phases,
    totalWeeks,
    onClose,
  }: CreateTrainingCycleParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateCreatePhaseFields({
      raceId,
      name,
      totalWeeks,
      startDate,
      endDate,
      phases,
    });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      console.error(errors);
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        ...(data.raceId ? { race_id: data.raceId } : {}),
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        name: data.name,
        total_weeks: data.totalWeeks,
        phases: data.phases.map((phase) => ({
          phase_type: phase.phaseType,
          duration_weeks: phase.durationWeeks,
        })),
      };
      await createTrainingCycle({ body, token });
      toast.success("Training cycle created successfully");
      await handleFetchAllTrainingCycles();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleDeleteTrainingCycle = async ({ id, onClose }: { id: string; onClose: () => void }): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setValidationsErrors(null);
    setApiError(null);

    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Training cycle id is required" });
      setLoading((prev) => ({ ...prev, delete: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      await deleteTrainingCycle({ id, token });
      toast.success("Training cycle deleted successfully");
      await handleFetchAllTrainingCycles();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    handleFetchAllTrainingCycles();
  }, [year]);

  return {
    handleFetchAllTrainingCycles,
    handleFetchTrainingCycleById,
    handleCreateTrainingCycle,
    handleDeleteTrainingCycle,
    validationsErrors,
    apiError,
    loading,
    trainingCycleList,
    trainingCycle,
  };
};
