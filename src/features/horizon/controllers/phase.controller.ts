import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import type { PhaseModel } from "../models/phase.model";
import { getFreshIdToken } from "@/lib/firebase/token";
import { createPhase, deletePhase, getPhaseById, getPhases, updatePhase } from "../data/phase.data";
import type { PhaseType } from "@/lib/types/type";
import { validateCreatePhaseFields, validateUpdatePhaseFields } from "../validations/phase.validation";

interface LoadingState {
  get: boolean;
  getAll: boolean;
  update: boolean;
  create: boolean;
  delete: boolean;
}

export const usePhaseController = () => {
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [phases, setPhases] = useState<PhaseModel[] | null>(null);
  const [phase, setPhase] = useState<PhaseModel | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    create: false,
    delete: false,
    get: false,
    getAll: false,
    update: false,
  });

  const handleFetchAllPhases = async (): Promise<PhaseModel[] | null> => {
    setLoading((prev) => ({ ...prev, getAll: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      const data = await getPhases({ token });
      setPhases(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, getAll: false }));
    }
  };

  const handleFetchPhaseById = async (id: string): Promise<PhaseModel | null> => {
    setLoading((prev) => ({ ...prev, get: true }));
    setApiError(null);
    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Phase id is required" });
      setLoading((prev) => ({ ...prev, get: false }));
      return null;
    }
    try {
      const token = await getFreshIdToken();
      const data = await getPhaseById({ id, token });
      setPhase(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  };

  const handleCreatePhase = async ({
    raceId,
    phaseType,
    startDate,
    endDate,
    description,
    weeklyVolumeTargetKm,
    weeklyElevationTargetM,
    onClose,
  }: {
    phaseType: PhaseType;
    startDate: Date;
    endDate: Date;
    raceId?: string;
    description?: string;
    weeklyVolumeTargetKm?: number;
    weeklyElevationTargetM?: number;
    onClose: () => void;
  }): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateCreatePhaseFields({
      raceId,
      phaseType,
      startDate,
      endDate,
      description,
      weeklyVolumeTargetKm,
      weeklyElevationTargetM,
    });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        race_id: data.raceId,
        phase_type: data.phaseType,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        description: data.description,
        weekly_volume_target_km: data.weeklyVolumeTargetKm,
        weekly_elevation_target_m: data.weeklyElevationTargetM,
      };
      await createPhase({ body, token });
      toast.success("Phase created successfully");
      await handleFetchAllPhases();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleUpdatePhase = async ({
    id,
    raceId,
    phaseType,
    startDate,
    endDate,
    description,
    weeklyVolumeTargetKm,
    weeklyElevationTargetM,
    onClose,
  }: {
    id: string;
    raceId?: string;
    phaseType?: PhaseType;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    weeklyVolumeTargetKm?: number;
    weeklyElevationTargetM?: number;
    onClose: () => void;
  }): Promise<void> => {
    setLoading((prev) => ({ ...prev, update: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateUpdatePhaseFields({
      id,
      raceId,
      phaseType,
      startDate,
      endDate,
      description,
      weeklyVolumeTargetKm,
      weeklyElevationTargetM,
    });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, update: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        race_id: data.raceId,
        phase_type: data.phaseType,
        start_date: data.startDate?.toISOString(),
        end_date: data.endDate?.toISOString(),
        description: data.description,
        weekly_volume_target_km: data.weeklyVolumeTargetKm,
        weekly_elevation_target_m: data.weeklyElevationTargetM,
      };
      await updatePhase({ id: data.id, body, token });
      toast.success("Phase updated successfully");
      await handleFetchAllPhases();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleDeletePhase = async ({ id, onClose }: { id: string; onClose: () => void }): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setValidationsErrors(null);
    setApiError(null);

    if (!id || id.trim() === "") {
      setValidationsErrors({ id: "Phase id is required" });
      setLoading((prev) => ({ ...prev, delete: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      await deletePhase({ id, token });
      toast.success("Phase deleted successfully");
      await handleFetchAllPhases();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    handleFetchAllPhases();
  }, []);

  return {
    handleFetchAllPhases,
    handleFetchPhaseById,
    handleCreatePhase,
    handleUpdatePhase,
    handleDeletePhase,
    validationsErrors,
    apiError,
    loading,
    phases,
    phase,
  };
};
