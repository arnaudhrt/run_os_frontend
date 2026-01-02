import { type PhaseType, phaseTypes } from "@/lib/types/type";
import { z } from "zod";

const phaseInputSchema = z.object({
  phaseType: z.enum(phaseTypes, { message: "Phase type is required" }),
  durationWeeks: z.number().int().positive(),
});

const createPhaseSchema = z.object({
  raceId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  phaseType: z.enum(phaseTypes, { message: "Phase type is required" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  phases: z.array(phaseInputSchema).min(1),
  totalWeeks: z.number().int().positive(),
});

type CreateResultData = z.infer<typeof createPhaseSchema>;

export const validateCreatePhaseFields = ({
  raceId,
  name,
  startDate,
  endDate,
  phases,
  totalWeeks,
}: {
  raceId?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  totalWeeks: number;
  phases: {
    phaseType: PhaseType;
    durationWeeks: number;
  }[];
}): { success: boolean; errors: Record<string, string> | null; data: CreateResultData | null } => {
  const result = createPhaseSchema.safeParse({
    raceId,
    name,
    startDate,
    endDate,
    phases,
    totalWeeks,
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
