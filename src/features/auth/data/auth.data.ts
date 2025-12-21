import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, type UserCredential } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import type { CreateUserModel, UserModel } from "../models/auth.model";

export async function getUser({ token }: { token: string }): Promise<UserModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/auth/user`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching user, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function registerEmail(email: string, password: string): Promise<UserCredential> {
  const useCredentials = await createUserWithEmailAndPassword(auth, email, password);
  return useCredentials;
}

export async function login(email: string, password: string): Promise<UserCredential> {
  const useCredentials = await signInWithEmailAndPassword(auth, email, password);
  return useCredentials;
}

export async function loginWithGoogle(): Promise<UserCredential> {
  const useCredentials = await signInWithPopup(auth, googleProvider);
  return useCredentials;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function registerUserInDatabase(userModel: CreateUserModel): Promise<void> {
  const url = `${import.meta.env.VITE_API_URL}/v1/auth/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userModel),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error registering user, check logs for more details");
  }
}

export async function sentForgotPasswordEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
