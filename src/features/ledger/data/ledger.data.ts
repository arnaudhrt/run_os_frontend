import type { StructuredActivitiesLog } from "../models/activity.model";

export async function syncGarmin({ token }: { token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/garmin/sync`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error syncing Garmin, check logs for more details");
  }
  console.log(response.json());
}

export async function getAllActivities({ token }: { token: string }): Promise<StructuredActivitiesLog> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error syncing Garmin, check logs for more details");
  }
  const data = await response.json();

  return data.data;
}
