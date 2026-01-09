import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialog } from "@/lib/ui/alert-dialog";
import { Label } from "@/lib/ui/label";
import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { Loader2, X } from "lucide-react";
import type { ConnectGarminParams } from "../controllers/garmin.controller";
import { useState } from "react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onLogin: (params: ConnectGarminParams) => Promise<void>;
  validationErrors: Record<string, string> | null;
}

export default function GarminCredentialsDialog({ open, loading, validationErrors, onLogin, onOpenChange }: DeleteDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-lg">Log In</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Email Address*</Label>
            <Input placeholder="Email" type="email" className="w-full mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            {validationErrors?.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
          </div>
          <div>
            <Label>Password*</Label>
            <Input placeholder="********" type="password" className="w-full mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            {validationErrors?.password && <p className="text-red-500 text-xs">{validationErrors.password}</p>}
          </div>
          <div className="flex items-start justify-between w-full pt-2">
            <Button onClick={() => onLogin({ email, password, onClose: () => onOpenChange(false) })}>
              Sign In
              {loading && <Loader2 className="animate-spin size-4" />}
            </Button>
            <div className="max-w-30">
              <img src="/garmin-connect-long.png" alt="" className="w-full h-auto" />
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Button className="" variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
