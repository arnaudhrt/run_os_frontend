import { getFreshIdToken } from "@/lib/firebase/token";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { Separator } from "@/lib/ui/separator";
import { Link2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function ServicesSection({ stravaConnection, garminConnection }: { stravaConnection: boolean; garminConnection: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const result = searchParams.get("strava");
  const connectStrava = async () => {
    const token = await getFreshIdToken();
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
      redirect_uri: `${import.meta.env.VITE_API_URL}/v1/strava/callback`,
      response_type: "code",
      scope: "read,activity:read_all",
      state: token,
    });

    window.location.href = `https://www.strava.com/oauth/authorize?${params}`;
  };

  useEffect(() => {
    if (result === "success") {
      toast.success("Connected successfully");
      setSearchParams({}, { replace: true }); // Clear params
    }
    if (result === "error") {
      toast.error("Error connecting, please try again");
      setSearchParams({}, { replace: true });
    }
  }, [result, setSearchParams]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>Link your fitness accounts to sync your activities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strava */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img src="/strava-icon.svg" alt="Strava" className="rounded-lg size-8" />
            <div>
              <p className="text-sm font-medium">Strava</p>
              <p className="text-xs text-muted-foreground">Sync runs, rides, and more</p>
            </div>
          </div>
          {stravaConnection ? (
            <Badge variant="secondary" className="gap-1 h-7 px-2.5 flex items-center justify-center">
              <Link2 className="size-4" />
              Connected
            </Badge>
          ) : (
            <Button variant="outline" size="sm" onClick={() => connectStrava()}>
              Connect
            </Button>
          )}
        </div>

        <Separator />

        {/* Garmin */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img src="/garmin-connect.png" alt="Garmin" className="size-8 rounded-lg " />
            <div>
              <p className="text-sm font-medium">Garmin Connect</p>
              <p className="text-xs text-muted-foreground">Sync from your Garmin device</p>
            </div>
          </div>
          {garminConnection ? (
            <Badge variant="secondary" className="gap-1">
              <Link2 className="size-3" />
              Connected
            </Badge>
          ) : (
            <Button variant="outline" size="sm">
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
