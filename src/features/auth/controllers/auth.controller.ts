import { useState } from "react";
import toast from "react-hot-toast";
import { registerUserInDatabase, sentForgotPasswordEmail, login, loginWithGoogle, logout, registerEmail } from "../data/auth.data";
import { verifyRegisterEmailFields, verifyForgotPasswordFields } from "../utils/auth.validation";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { handleError } from "@/lib/errors/clientErrors.handler";
import type { CreateUserModel } from "../models/auth.model";

interface LoadingState {
  email: boolean;
  google: boolean;
  logout: boolean;
  forgotPassword: boolean;
}

export const useAuthController = () => {
  const navigate = useNavigate();
  const [validationsErrors, setValidationsErrors] = useState<Record<string, string> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    email: false,
    google: false,
    logout: false,
    forgotPassword: false,
  });

  const handleRegisterWithEmail = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> => {
    // Reset states
    setLoading((prev) => ({ ...prev, email: true }));
    setValidationsErrors(null);
    setApiError(null);
    // Fields validation
    const { success, errors } = verifyRegisterEmailFields(firstName, lastName, email, password);
    if (!success) {
      setValidationsErrors(errors);
      return;
    }
    // Async operation
    try {
      // Register user in Firebase auth
      const userCredential = await registerEmail(email, password);
      // Update user profile with name
      await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });
      // Create user model and register in database
      const firebaseUid = userCredential.user.uid;
      const userModel: CreateUserModel = {
        first_name: firstName,
        last_name: lastName,
        firebase_uid: firebaseUid,
        email,
      };
      await registerUserInDatabase(userModel);
      // Redirect to pending activation
      navigate("/app/seasons");
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleLoginWithEmail = async (email: string, password: string): Promise<void> => {
    // Reset states
    setLoading((prev) => ({ ...prev, email: true }));
    setApiError(null);
    // Async operation
    try {
      // Login user in Firebase auth
      await login(email, password);
      // Redirect to dashboard
      navigate("/app/seasons");
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleLoginWithGoogle = async (): Promise<void> => {
    // Reset states
    setLoading((prev) => ({ ...prev, google: true }));
    setApiError(null);
    // Async operation
    try {
      // Login/register user with Google in Firebase auth
      const userCredential = await loginWithGoogle();
      const firebaseUser = userCredential.user;
      const firebaseUid = firebaseUser.uid;

      const displayName = firebaseUser.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const email = firebaseUser.email || "";

      const userModel: CreateUserModel = {
        first_name: firstName,
        last_name: lastName,
        firebase_uid: firebaseUid,
        email,
      };

      await registerUserInDatabase(userModel);
      navigate("/app/season");
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleLogout = async (): Promise<void> => {
    // Reset states
    setLoading((prev) => ({ ...prev, logout: true }));
    setApiError(null);
    // Async operation
    try {
      await logout();
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const handleForgotPassword = async (email: string): Promise<void> => {
    // Reset states
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    setValidationsErrors(null);
    setApiError(null);
    // Fields validation
    const { success, errors } = verifyForgotPasswordFields(email);
    if (!success) {
      setValidationsErrors(errors);
      return;
    }
    // Async operation
    try {
      await sentForgotPasswordEmail(email);
      toast.success("Forgot password email sent! Check your email for instructions.");
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setApiError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  };

  return {
    handleLoginWithEmail,
    handleLoginWithGoogle,
    handleLogout,
    handleRegisterWithEmail,
    handleForgotPassword,
    validationsErrors,
    apiError,
    loading,
  };
};
