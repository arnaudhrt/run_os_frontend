import { z } from "zod";
import { activityTypes, workoutTypes } from "@/lib/types/type";
import type { CreatePlannedWorkoutParams, UpdatePlannedWorkoutParams } from "../controllers/planned-workout.controller";

const timeSlots = ["am", "pm", "single"] as const;

const createPlannedWorkoutSchema = z.object({
  plannedDate: z.string().min(1, "Planned date is required"),
  timeSlot: z.enum(timeSlots, { message: "Time slot must be am, pm, or single" }),
  activityType: z.enum(activityTypes, { message: "Activity type is required" }),
  workoutType: z.enum(workoutTypes, { message: "Workout type is required" }).optional(),
  targetDistanceMeters: z.number().positive("Distance must be positive").nullable().optional(),
  targetDurationSeconds: z.number().positive("Duration must be positive").nullable().optional(),
  description: z.string().nullable().optional(),
  activityId: z.string().nullable().optional(),
});

type CreateResultData = z.infer<typeof createPlannedWorkoutSchema>;

export function validateCreatePlannedWorkoutFields(params: Omit<CreatePlannedWorkoutParams, "onClose">): {
  success: boolean;
  errors: Record<string, string> | null;
  data: CreateResultData | null;
} {
  const result = createPlannedWorkoutSchema.safeParse(params);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      errors[fieldName] = error.message;
    });
    return { success: false, errors, data: null };
  }

  return { success: true, errors: null, data: result.data };
}

const updatePlannedWorkoutSchema = z.object({
  id: z.string().min(1, "Workout id is required"),
  plannedDate: z.string().min(1, "Planned date is required").optional(),
  timeSlot: z.enum(timeSlots, { message: "Time slot must be am, pm, or single" }).optional(),
  activityType: z.enum(activityTypes, { message: "Activity type is required" }).optional(),
  workoutType: z.enum(workoutTypes, { message: "Workout type is required" }).optional(),
  targetDistanceMeters: z.number().positive("Distance must be positive").nullable().optional(),
  targetDurationSeconds: z.number().positive("Duration must be positive").nullable().optional(),
  description: z.string().nullable().optional(),
  activityId: z.string().nullable().optional(),
});

type UpdateResultData = z.infer<typeof updatePlannedWorkoutSchema>;

export function validateUpdatePlannedWorkoutFields(params: Omit<UpdatePlannedWorkoutParams, "onClose">): {
  success: boolean;
  errors: Record<string, string> | null;
  data: UpdateResultData | null;
} {
  const result = updatePlannedWorkoutSchema.safeParse(params);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      errors[fieldName] = error.message;
    });
    return { success: false, errors, data: null };
  }

  return { success: true, errors: null, data: result.data };
}
