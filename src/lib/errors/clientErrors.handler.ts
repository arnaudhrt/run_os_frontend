import { generateFirebaseAuthErrorMessage } from "./generateAuthErrorMessage";
import { FirebaseError } from "firebase/app";

export const handleError = (error: unknown) => {
  // handle Firebase errors
  if (error instanceof FirebaseError) {
    const errorMessage = generateFirebaseAuthErrorMessage(error);
    return errorMessage;
  }

  return `An error occured during the operation. Please reload the page and try again.`;
};
