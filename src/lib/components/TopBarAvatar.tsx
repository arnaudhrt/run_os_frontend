"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { LogOut, ChevronDown, User, Loader2 } from "lucide-react";
import { useAuthController } from "@/features/auth/controllers/auth.controller";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export default function TopBarAvatar() {
  const { handleLogout, loading } = useAuthController();
  const { dbUser } = useAuthStore();
  const navigate = useNavigate();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!dbUser) {
    return (
      <div className="flex items-center gap-2 hover:bg-accent rounded-lg px-2 py-1 transition-colors min-w-50">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-accent rounded-lg flex justify-center items-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">Loading my profile...</p>
            </div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  const displayName = `${dbUser.first_name} ${dbUser.last_name}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent rounded-lg px-2 py-1 transition-colors min-w-50">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={undefined} />
              <AvatarFallback className="text-xs font-medium">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">My Workspace</p>
            </div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={undefined} />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{dbUser.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/app/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600  focus:bg-red-50" disabled={loading.logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading.logout ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
