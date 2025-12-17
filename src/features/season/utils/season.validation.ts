import { z } from "zod";

interface Result {
  name: string;
  startDate: Date;
  endDate: Date;
}

const createSeasonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.date(),
  endDate: z.date(),
});

export const validateCreateSeasonFields = ({
  name,
  startDate,
  endDate,
}: {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}): { success: boolean; errors: Record<string, string> | null; data: Result | null } => {
  const result = createSeasonSchema.safeParse({
    name,
    startDate,
    endDate,
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
