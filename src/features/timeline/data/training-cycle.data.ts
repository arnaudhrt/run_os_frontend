import type { CreateTrainingCycleModel, TrainingCycleModel, WeeklyStats } from "../models/training-cycle.model";

export async function getTrainingCycles({ token, year }: { token: string; year: number }): Promise<TrainingCycleModel[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/training-cycles`);
  url.searchParams.append("year", year.toString());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching training cycles, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function getWeeklyStats({ token, year }: { token: string; year: number }): Promise<WeeklyStats[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/activities/weekly-stats/${year}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching weekly stats, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function getTrainingCycleById({ id, token }: { id: string; token: string }): Promise<TrainingCycleModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/training-cycles/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching training cycle by id, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function createTrainingCycle({ body, token }: { body: CreateTrainingCycleModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/training-cycles`);
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
    throw new Error("Error creating training cycle, check logs for more details");
  }
}

export async function updateTrainingCycle({ id, body, token }: { id: string; body: CreateTrainingCycleModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/training-cycles/${id}`);
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
    throw new Error("Error updating training cycle, check logs for more details");
  }
}

export async function deleteTrainingCycle({ id, token }: { id: string; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/training-cycles/${id}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error deleting training cycle, check logs for more details");
  }
}
