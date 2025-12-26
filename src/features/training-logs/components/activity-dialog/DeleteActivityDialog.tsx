import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialog,
} from "@/lib/ui/alert-dialog";

interface DeleteDialogProps {
  onDelete: () => Promise<void>;
  children: React.ReactNode;
}

export default function DeleteDialog({ onDelete, children }: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer" asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be <span className="px-1 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-md">undone</span>.
            This will permanently <span className="px-1 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-md">delete</span>{" "}
            the activity and remove it from our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="cursor-pointer">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
