import { type PhaseType, phaseTypes } from "@/lib/types/type";
import { z } from "zod";

const createPhaseSchema = z.object({
  raceId: z.string().optional(),
  phaseType: z.enum(phaseTypes, { message: "Phase type is required" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  description: z.string().optional(),
  weeklyVolumeTargetKm: z.number().optional(),
  weeklyElevationTargetM: z.number().optional(),
});

type CreateResultData = z.infer<typeof createPhaseSchema>;

export const validateCreatePhaseFields = ({
  raceId,
  phaseType,
  startDate,
  endDate,
  description,
  weeklyVolumeTargetKm,
  weeklyElevationTargetM,
}: {
  raceId?: string;
  phaseType: PhaseType;
  startDate: Date;
  endDate: Date;
  description?: string;
  weeklyVolumeTargetKm?: number;
  weeklyElevationTargetM?: number;
}): { success: boolean; errors: Record<string, string> | null; data: CreateResultData | null } => {
  const result = createPhaseSchema.safeParse({
    raceId,
    phaseType,
    startDate,
    endDate,
    description,
    weeklyVolumeTargetKm,
    weeklyElevationTargetM,
  });

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      errors[fieldName] = error.message;
    });

    return { success: false, errors, data: null };
  }

  return { success: true, errors: null, data: result.data };
};

const updatePhaseSchema = z.object({
  id: z.string().min(1, "Phase id is required"),
  raceId: z.string().optional(),
  phaseType: z.enum(phaseTypes, { message: "Phase type is required" }).optional(),
  startDate: z.date({ message: "Start date is required" }).optional(),
  endDate: z.date({ message: "End date is required" }).optional(),
  description: z.string().optional(),
  weeklyVolumeTargetKm: z.number().optional(),
  weeklyElevationTargetM: z.number().optional(),
});

type UpdateResultData = z.infer<typeof updatePhaseSchema>;

export const validateUpdatePhaseFields = ({
  id,
  raceId,
  phaseType,
  startDate,
  endDate,
  description,
  weeklyVolumeTargetKm,
  weeklyElevationTargetM,
}: {
  id: string;
  raceId?: string;
  phaseType?: PhaseType;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  weeklyVolumeTargetKm?: number;
  weeklyElevationTargetM?: number;
}): { success: boolean; errors: Record<string, string> | null; data: UpdateResultData | null } => {
  const result = updatePhaseSchema.safeParse({
    id,
    raceId,
    phaseType,
    startDate,
    endDate,
    description,
    weeklyVolumeTargetKm,
    weeklyElevationTargetM,
  });

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      errors[fieldName] = error.message;
    });

    return { success: false, errors, data: null };
  }

  return { success: true, errors: null, data: result.data };
};
