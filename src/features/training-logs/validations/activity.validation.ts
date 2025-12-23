import { workoutTypes, type ActivityType, type RPE, type WorkoutType } from "@/lib/types/type";
import z from "zod";

const activityTypes = ["run", "trail", "treadmill", "walk", "hike", "bike", "swim", "strength", "cross_training", "rest_day"] as const;

const updateActivitySchema = z.object({
  id: z.string().min(1, "Activity id is required"),
  rpe: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)], {
      message: "RPE is required",
    })
    .optional(),
  notes: z.string().optional(),
  workoutType: z
    .enum(workoutTypes, {
      message: "Workout type is required",
    })
    .optional(),
});

type UpdateResultData = z.infer<typeof updateActivitySchema>;

export const validateUpdateActivityFields = ({
  id,
  rpe,
  notes,
  workoutType,
}: {
  id: string;
  rpe?: RPE;
  notes?: string;
  workoutType?: WorkoutType;
}): { success: boolean; errors: Record<string, string> | null; data: UpdateResultData | null } => {
  const result = updateActivitySchema.safeParse({
    id,
    rpe,
    notes,
    workoutType,
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

// Create Activity Validation
const createActivitySchema = z.object({
  activityType: z.enum(activityTypes, {
    message: "Activity type is required",
  }),
  workoutType: z.enum([...workoutTypes, "uncategorized"] as const, {
    message: "Workout type is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  distanceMeters: z.number().positive("Distance must be positive").optional(),
  durationSeconds: z.number().positive("Duration must be positive").optional(),
  elevationGainMeters: z.number().min(0, "Elevation must be non-negative").optional(),
  avgHeartRate: z.number().min(30).max(250).optional(),
  maxHeartRate: z.number().min(30).max(250).optional(),
  avgCadence: z.number().min(0).max(300).optional(),
  calories: z.number().min(0).optional(),
  steps: z.number().min(0).optional(),
  avgTemperatureCelsius: z.number().min(-50).max(60).optional(),
  isPr: z.boolean().optional(),
  rpe: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  notes: z.string().optional(),
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
  avgCadence,
  calories,
  steps,
  avgTemperatureCelsius,
  isPr,
  rpe,
  notes,
}: {
  activityType: ActivityType;
  workoutType: WorkoutType;
  startTime: string;
  distanceMeters?: number;
  durationSeconds?: number;
  elevationGainMeters?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  calories?: number;
  steps?: number;
  avgTemperatureCelsius?: number;
  isPr?: boolean;
  rpe?: RPE;
  notes?: string;
}): { success: boolean; errors: Record<string, string> | null; data: CreateResultData | null } => {
  const result = createActivitySchema.safeParse({
    activityType,
    workoutType,
    startTime,
    distanceMeters,
    durationSeconds,
    elevationGainMeters,
    avgHeartRate,
    maxHeartRate,
    avgCadence,
    calories,
    steps,
    avgTemperatureCelsius,
    isPr,
    rpe,
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
