import { useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import type { SeasonModel } from "../models/season.model";
import { getFreshIdToken } from "@/lib/firebase/token";
import { createSeason, getActiveSeason } from "../data/season.data";
import { validateCreateSeasonFields } from "../utils/season.validation";

interface LoadingState {
  activeSeason: boolean;
  create: boolean;
}

export const useSeasonController = () => {
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonModel | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    activeSeason: false,
    create: false,
  });

  const handleFetchActiveSeason = async (): Promise<SeasonModel | null> => {
    setLoading((prev) => ({ ...prev, activeSeason: true }));
    setApiError(null);
    try {
      const token = await getFreshIdToken();
      const data = await getActiveSeason({ token });
      setActiveSeason(data);
      return data;
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, recommendation: false }));
    }
  };

  const handleCreateSeason = async ({
    startDate,
    endDate,
    name,
    onClose,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    name: string;
    onClose: () => void;
  }): Promise<void> => {
    setLoading((prev) => ({ ...prev, create: true }));
    setValidationsErrors(null);
    setApiError(null);

    const { success, errors, data } = validateCreateSeasonFields({ startDate, endDate, name });
    if (!success || !data) {
      setValidationsErrors(errors);
      setLoading((prev) => ({ ...prev, create: false }));
      return;
    }
    try {
      const token = await getFreshIdToken();
      const body = {
        name,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
      };
      await createSeason({ body, token });
      toast.success("Season created successfully");
      await handleFetchActiveSeason();
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  return {
    handleFetchActiveSeason,
    handleCreateSeason,
    activeSeason,
    validationsErrors,
    apiError,
    loading,
  };
};
