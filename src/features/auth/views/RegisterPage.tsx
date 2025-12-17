"use client";
import { useState } from "react";
import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { Label } from "@/lib/ui/label";
import { Loader } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuthController } from "../controllers/auth.controller";
import { Link } from "react-router-dom";
import { Separator } from "@/lib/ui/separator";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const { handleRegisterWithEmail, handleLoginWithGoogle, validationsErrors, apiError, loading } = useAuthController();
  const isDisabled = !password || !firstName || !lastName || !email;

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <p className="text-xl font-bold text-center">RunOS</p>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an account</h1>

        <div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Button
              variant="outline"
              className="w-full h-10 sm:h-11  transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg relative"
              onClick={() => handleLoginWithGoogle()}
              disabled={loading.email || loading.google}
            >
              <FcGoogle className="size-6 absolute top-1/2 -translate-y-1/2 left-3" />
              <span className="text-sm font-medium">Sign up with Google</span>
              {loading.google && <Loader className="h-4 w-4 animate-spin" />}
            </Button>

            <Separator />

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-medium">
                    First name
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading.email}
                    className="h-10 sm:h-11 rounded-lg"
                    required
                  />
                  {validationsErrors?.firstName && <p className="text-xs text-red-600 mt-1">{validationsErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading.email}
                    className="h-10 sm:h-11 rounded-lg"
                    required
                  />
                  {validationsErrors?.lastName && <p className="text-xs text-red-600 mt-1">{validationsErrors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="myemail@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading.email}
                  className="h-10 sm:h-11 rounded-lg"
                  required
                />
                {validationsErrors?.email && <p className="text-xs text-red-600 mt-1">{validationsErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading.email}
                  className="h-10 sm:h-11 rounded-lg"
                  required
                />
                {validationsErrors?.password && <p className="text-xs text-red-600 mt-1">{validationsErrors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
                onClick={() => handleRegisterWithEmail({ email, password, firstName, lastName })}
                disabled={loading.email || isDisabled || loading.google}
              >
                <span>Sign up</span>
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
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
