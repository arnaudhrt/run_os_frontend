import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { Separator } from "@/lib/ui/separator";
import { Mail, Loader2, Edit } from "lucide-react";
import { format } from "date-fns";
import type { UserModel } from "@/features/auth/models/auth.model";
import { Button } from "@/lib/ui/button";

export default function UserInfoSection({ user }: { user: UserModel | null }) {
  if (!user) {
    return (
      <Card className="shadow-none">
        <div className="flex justify-center items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <p className="text-sm font-medium">Loading my profile...</p>
        </div>
      </Card>
    );
  }
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = `${user.first_name} ${user.last_name}`;

  return (
    <Card className="shadow-none relative">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={undefined} />
            <AvatarFallback className="text-lg font-medium">{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm flex items-center gap-1.5">{format(user.created_at, "MMM dd yyyy")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last sign in</span>
            <span className="text-sm">{format(user.updated_at, "MMM dd yyyy")}</span>
          </div>
        </div>
      </CardContent>
      <div className="absolute top-3 right-3">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
