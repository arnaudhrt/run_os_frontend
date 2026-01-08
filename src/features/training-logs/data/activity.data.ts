import type { ActivityModel, ActivitiesResponse, CreateActivityModel, UpdateActivityModel } from "../models/activity.model";

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
}

export async function getAllActivities({ token }: { token: string }): Promise<ActivitiesResponse> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching all activities, check logs for more details");
  }
  const data = await response.json();

  return data.data;
}

export async function updateActivity({ token, id, body }: { token: string; id: string; body: UpdateActivityModel }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities/${id}`);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error updating activity, check logs for more details");
  }
}

export async function createActivity({ token, body }: { token: string; body: CreateActivityModel }): Promise<ActivityModel> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error creating activity, check logs for more details");
  }

  const data = await response.json();
  return data.data;
}

export async function deleteActivity({ token, id }: { token: string; id: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error deleting activity, check logs for more details");
  }
}
