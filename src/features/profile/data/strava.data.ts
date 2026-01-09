import { getFreshIdToken } from "@/lib/firebase/token";

export const connectStrava = async () => {
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
