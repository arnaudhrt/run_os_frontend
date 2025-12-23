import { type RaceType, raceTypes } from "@/lib/types/type";
import { z } from "zod";

const createRaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  raceDate: z.date({ message: "Race date is required" }),
  raceType: z.enum(raceTypes, { message: "Race type is required" }),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)], { message: "Priority must be 1, 2, or 3" }),
  isCompleted: z.boolean(),
  elevation: z.number().optional(),
  distance: z.number().optional(),
  targetTime: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type ResultData = z.infer<typeof createRaceSchema>;

export const validateCreateRaceFields = ({
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
}: {
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
}): { success: boolean; errors: Record<string, string> | null; data: ResultData | null } => {
  const result = createRaceSchema.safeParse({
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

const updateRaceSchema = z.object({
  id: z.string().min(1, "Race id is required"),
  name: z.string().min(1, "Name is required").optional(),
  raceDate: z.string().min(1, "Race date is required").optional(),
  raceType: z.enum(raceTypes, { message: "Race type is required" }).optional(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)], { message: "Priority must be 1, 2, or 3" }).optional(),
  isCompleted: z.boolean().optional(),
  elevation: z.number().optional(),
  distance: z.number().optional(),
  targetTime: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  resultTime: z.number().optional(),
  resultPlace: z.string().optional(),
});

type UpdateResultData = z.infer<typeof updateRaceSchema>;

export const validateUpdateRaceFields = ({
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
  resultPlace,
}: {
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
  resultPlace?: string;
}): { success: boolean; errors: Record<string, string> | null; data: UpdateResultData | null } => {
  const result = updateRaceSchema.safeParse({
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
    resultPlace,
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
