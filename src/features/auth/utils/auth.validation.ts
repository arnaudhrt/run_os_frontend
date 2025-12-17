import { z } from "zod";

const registerEmailSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const forgotPasswordSchema = z.object({
  email: z.email("Email is required"),
});

export const verifyRegisterEmailFields = (firstName: string, lastName: string, email: string, password: string) => {
  const result = registerEmailSchema.safeParse({ firstName, lastName, email, password });
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      fieldErrors[fieldName] = error.message;
    });

    return { success: false, errors: fieldErrors };
  }

  return { success: true, errors: null };
};

export const verifyForgotPasswordFields = (email: string) => {
  const result = forgotPasswordSchema.safeParse({ email });
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((error) => {
      const fieldName = error.path[0] as string;
      fieldErrors[fieldName] = error.message;
    });

    return { success: false, errors: fieldErrors };
  }

  return { success: true, errors: null };
};
