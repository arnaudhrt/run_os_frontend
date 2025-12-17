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
import { LogOut, ChevronDown } from "lucide-react";
import { useAuthController } from "@/features/auth/controllers/auth.controller";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export default function TopBarAvatar() {
  const { handleLogout, loading } = useAuthController();
  const { user } = useAuthStore();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent rounded-lg px-2 py-1 transition-colors min-w-50">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="text-xs font-medium">{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{user?.displayName || "Admin User"}</p>
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
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user?.displayName || "Admin User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600  focus:bg-red-50" disabled={loading.logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading.logout ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
