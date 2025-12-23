"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { auth } from "../firebase/config";
import Navbar from "./Navbar";
import { useAuthController } from "@/features/auth/controllers/auth.controller";

export default function ProtectedRoutes() {
  const { authUser, setAuthUser, setDbUser } = useAuthStore();
  const { handleFetchUser } = useAuthController();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setAuthUser(user);
          const dbUser = await handleFetchUser();
          console.log(dbUser);
          setDbUser(dbUser);
        } else {
          setAuthUser(null);
          setDbUser(null);
        }
      } catch (error) {
        console.error(error);
        setAuthUser(null);
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Loading Dashboard</h2>
              <p className="text-sm text-muted-foreground">Authenticating and preparing your workspace...</p>
            </div>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !authUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
