import { activityTypes, allWorkoutTypes, type ValidationResponse } from "@/lib/types/type";
import z from "zod";

// UPDATE ACTIVITY VALIDATION
const updateActivitySchema = z.object({
  id: z.string().min(1, "Activity id is required"),
  activityType: z.enum(activityTypes, { message: "Activity type is required" }).optional(),
  workoutType: z.enum(allWorkoutTypes, { message: "Workout type is required" }).optional(),
  distanceMeters: z.number().positive("Distance must be positive").optional(),
  durationSeconds: z.number().positive("Duration must be positive").optional(),
  elevationGainMeters: z.number().min(0, "Elevation must be non-negative").optional(),
  avgHeartRate: z.number().min(30).max(250).optional(),
  maxHeartRate: z.number().min(30).max(250).optional(),
  avgTemperatureCelsius: z.number().min(-50).max(60).optional(),
  isPr: z.boolean().optional(),
  hasPain: z.string().optional(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  shoesId: z.string().optional(),
});

type UpdateResultData = z.infer<typeof updateActivitySchema>;

export const validateUpdateActivityFields = ({
  id,
  activityType,
  workoutType,
  distanceMeters,
  durationSeconds,
  elevationGainMeters,
  avgHeartRate,
  maxHeartRate,
  avgTemperatureCelsius,
  isPr,
  hasPain,
  rpe,
  notes,
  shoesId,
}: UpdateResultData): ValidationResponse<UpdateResultData> => {
  const result = updateActivitySchema.safeParse({
    id,
    activityType,
    workoutType,
    distanceMeters,
    durationSeconds,
    elevationGainMeters,
    avgHeartRate,
    maxHeartRate,
    avgTemperatureCelsius,
    isPr,
    hasPain,
    rpe,
    notes,
    shoesId,
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

// CREATE ACTIVITY VALIDATION
const createActivitySchema = z.object({
  activityType: z.enum(activityTypes, {
    message: "Activity type is required",
  }),
  workoutType: z
    .enum(allWorkoutTypes, {
      message: "Workout type is required",
    })
    .optional(),
  startTime: z.string().min(1, "Start time is required"),
  distanceMeters: z.number().positive("Distance must be positive").optional(),
  durationSeconds: z.number().positive("Duration must be positive").optional(),
  elevationGainMeters: z.number().min(0, "Elevation must be non-negative").optional(),
  avgHeartRate: z.number().min(30).max(250).optional(),
  maxHeartRate: z.number().min(30).max(250).optional(),
  avgTemperatureCelsius: z.number().min(-50).max(60).optional(),
  isPr: z.boolean().optional(),
  hasPain: z.string().optional(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  shoesId: z.string().optional(),
});

type CreateResultData = z.infer<typeof createActivitySchema>;

export const validateCreateActivityFields = ({
  activityType,
  workoutType,
  startTime,
  distanceMeters,
  durationSeconds,
  elevationGainMeters,
  avgHeartRate,
  maxHeartRate,
  avgTemperatureCelsius,
  isPr,
  hasPain,
  rpe,
  notes,
  shoesId,
}: CreateResultData): ValidationResponse<CreateResultData> => {
  const result = createActivitySchema.safeParse({
    activityType,
    workoutType,
    startTime,
    distanceMeters,
    durationSeconds,
    elevationGainMeters,
    avgHeartRate,
    maxHeartRate,
    avgTemperatureCelsius,
    isPr,
    hasPain,
    rpe,
    notes,
    shoesId,
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
