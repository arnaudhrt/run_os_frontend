import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { Separator } from "@/lib/ui/separator";
import { Mail, Edit } from "lucide-react";
import { format } from "date-fns";
import type { UserModel } from "@/features/auth/models/auth.model";
import { Button } from "@/lib/ui/button";

export default function UserInfoSection({ user }: { user: UserModel }) {
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gender:</span>
            <span className="text-sm flex items-center gap-1.5">{"Male ♂"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Birthday:</span>
            <span className="text-sm flex items-center gap-1.5">{format(new Date(), "MMM dd yyyy")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="text-sm flex items-center gap-1.5">{format(user.created_at, "MMM dd yyyy")}</span>
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
