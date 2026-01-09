import { useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import { connectToGarmin, disconnectFromGarmin, syncGarminActivities } from "../data/gamin.data";
import { validateConnectGarminFields } from "../validations/garmin.validation";

export interface GarminLoadingState {
  connect: boolean;
  disconnect: boolean;
  sync: boolean;
}

export interface ConnectGarminParams {
  email: string;
  password: string;
  onClose: () => void;
}

export const useGarminController = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<GarminLoadingState>({
    connect: false,
    disconnect: false,
    sync: false,
  });

  const handleGarminConnection = async ({ email, password, onClose }: ConnectGarminParams): Promise<void> => {
    setLoading((prev) => ({ ...prev, connect: true }));
    setValidationErrors(null);
    setApiError(null);

    const { success, errors, data } = validateConnectGarminFields({ email, password });

    if (!success || !data) {
      setValidationErrors(errors);
      setLoading((prev) => ({ ...prev, connect: false }));
      return;
    }

    try {
      const token = await getFreshIdToken();
      await connectToGarmin({ token, email: data.email, password: data.password });
      toast.success("Connected to Garmin successfully");
      onClose();
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, connect: false }));
    }
  };

  const handleGarminDisconnect = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, disconnect: true }));
    setApiError(null);

    try {
      const token = await getFreshIdToken();
      await disconnectFromGarmin({ token });
      toast.success("Disconnected from Garmin successfully");
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, disconnect: false }));
    }
  };

  const handleSync = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, sync: true }));
    setApiError(null);

    try {
      const token = await getFreshIdToken();
      await syncGarminActivities({ token });
      toast.success("Garmin activities synced successfully");
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, sync: false }));
    }
  };

  return {
    // State
    validationErrors,
    apiError,
    loading,
    // Actions
    handleGarminConnection,
    handleGarminDisconnect,
    handleSync,
  };
};
