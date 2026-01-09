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
  onDisconnect: () => Promise<void>;
  children: React.ReactNode;
}

export default function GarminDisconnectDialog({ onDisconnect, children }: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer" asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect from Garmin?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{" "}
            <span className="px-1 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-md">Disconnect</span> your Garmin
            account? If you continue RunOS will keep your activities but will no longer be able to sync your future activities.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDisconnect} className="cursor-pointer">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
