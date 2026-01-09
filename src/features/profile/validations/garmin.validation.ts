import { z } from "zod";

const connectGarminSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type ConnectGarminData = z.infer<typeof connectGarminSchema>;

export const validateConnectGarminFields = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): { success: boolean; errors: Record<string, string> | null; data: ConnectGarminData | null } => {
  const result = connectGarminSchema.safeParse({ email, password });

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
