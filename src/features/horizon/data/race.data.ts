//import type { CreateRaceModel, CreateSeasonModel, SeasonModel } from "../models/season.model";

import type { CreateRaceModel, RaceModel, UpdateRaceModel } from "../models/race.model";

export async function getRaces({ token }: { token: string }): Promise<RaceModel[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/races`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching active season, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function getRaceById({ id, token }: { id: string; token: string }): Promise<RaceModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/races/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching active season, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function createRace({ body, token }: { body: CreateRaceModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/races`);
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
    throw new Error("Error creating season, check logs for more details");
  }
}

export async function updateRace({ id, body, token }: { id: string; body: UpdateRaceModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/races/${id}`);
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
    throw new Error("Error creating season, check logs for more details");
  }
}

export async function deleteRace({ id, token }: { id: string; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/races/${id}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error creating season, check logs for more details");
  }
}
