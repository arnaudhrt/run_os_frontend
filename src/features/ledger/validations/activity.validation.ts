import { workoutTypes, type RPE, type WorkoutType } from "@/lib/types/type";
import z from "zod";

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
