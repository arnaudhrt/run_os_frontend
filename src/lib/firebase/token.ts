import { auth } from "./config";

export async function getFreshIdToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get token");
  }
}
