import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleError } from "@/lib/errors/clientErrors.handler";
import { getFreshIdToken } from "@/lib/firebase/token";
import { getAllActivities, syncGarmin } from "../data/ledger.data";
import type { StructuredActivitiesLog } from "../models/activity.model";

export interface LoadingState {
  syncGarmin: boolean;
  getAll: boolean;
}

export const useLedgerController = () => {
  const [structuredActivitiesLog, setStructuredActivitiesLog] = useState<StructuredActivitiesLog | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    syncGarmin: false,
    getAll: false,
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
      setStructuredActivitiesLog(data);
    } catch (err) {
      const errorMessage = handleError(err);
      setApiError(errorMessage);
      toast.error("Failed to fetch all activities");
    } finally {
      setLoading((prev) => ({ ...prev, getAll: false }));
    }
  };

  useEffect(() => {
    handleFetchAllActivities();
  }, []);

  return {
    handleFetchAllActivities,
    handleSyncGarmin,
    structuredActivitiesLog,
    apiError,
    loading,
  };
};
