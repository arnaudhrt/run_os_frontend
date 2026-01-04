import type { CreatePlannedWorkoutModel, PlannedWorkoutModel, UpdatePlannedWorkoutModel } from "../models/planned-workout.model";

export async function getPlannedWorkoutsByDateRange({
  startDate,
  endDate,
  token,
}: {
  startDate: string;
  endDate: string;
  token: string;
}): Promise<PlannedWorkoutModel[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/planned-workouts`);
  url.searchParams.set("start", startDate);
  url.searchParams.set("end", endDate);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching planned workouts, check logs for more details");
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function getPlannedWorkoutById({ id, token }: { id: string; token: string }): Promise<PlannedWorkoutModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/planned-workouts/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching planned workout, check logs for more details");
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function createPlannedWorkout({ body, token }: { body: CreatePlannedWorkoutModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/planned-workouts`);

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
    throw new Error("Error creating planned workout, check logs for more details");
  }
}

export async function updatePlannedWorkout({ id, body, token }: { id: string; body: UpdatePlannedWorkoutModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/planned-workouts/${id}`);

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
    throw new Error("Error updating planned workout, check logs for more details");
  }
}

export async function deletePlannedWorkout({ id, token }: { id: string; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/planned-workouts/${id}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error deleting planned workout, check logs for more details");
  }
}
