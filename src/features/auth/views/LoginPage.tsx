"use client";
import { useState } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { useAuthController } from "../controllers/auth.controller";
import { Loader } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Separator } from "@/lib/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { validationsErrors, apiError, loading, handleLoginWithEmail, handleLoginWithGoogle } = useAuthController();

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <p className="text-xl font-bold text-center">RunOS</p>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>

        <div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Button
              variant="outline"
              className="w-full h-10 sm:h-11  transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg relative"
              onClick={() => handleLoginWithGoogle()}
              disabled={loading.email || loading.google}
            >
              <FcGoogle className="size-6 absolute top-1/2 -translate-y-1/2 left-3" />
              <span className="text-sm font-medium">Sign in with Google</span>
              {loading.google && <Loader className="h-4 w-4 animate-spin" />}
            </Button>
            <Separator />
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="my-email@domain.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11 rounded-lg"
                  required
                />
                {validationsErrors?.email && <p className="text-sm text-red-500 mt-1">{validationsErrors?.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 sm:h-11 rounded-lg"
                  required
                />
                {validationsErrors?.password && <p className="text-sm text-red-500 mt-1">{validationsErrors?.password}</p>}
              </div>

              <Button
                className="w-full h-10 sm:h-11 flex items-center justify-center gap-2 cursor-pointer text-base rounded-lg"
                onClick={() => handleLoginWithEmail(email, password)}
                disabled={loading.email || loading.google || !password || !email}
              >
                <span>Sign in</span>
                {loading.email && <Loader className="h-4 w-4 animate-spin" />}
              </Button>

              {apiError && (
                <div className="text-center">
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{apiError}</p>
                </div>
              )}
            </div>

            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
