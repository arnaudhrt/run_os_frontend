//import type { CreateRaceModel, CreateSeasonModel, SeasonModel } from "../models/season.model";

import type { PhaseModel, CreatePhaseModel, UpdatePhaseModel } from "../models/phase.model";

export async function getPhases({ token }: { token: string }): Promise<PhaseModel[]> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/phases`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching phases, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function getPhaseById({ id, token }: { id: string; token: string }): Promise<PhaseModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/phases/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error fetching phase by id, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function createPhase({ body, token }: { body: CreatePhaseModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/phases`);
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
    throw new Error("Error creating phase, check logs for more details");
  }
}

export async function updatePhase({ id, body, token }: { id: string; body: UpdatePhaseModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/phases/${id}`);
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
    throw new Error("Error updating phase, check logs for more details");
  }
}

export async function deletePhase({ id, token }: { id: string; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/phases/${id}`);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error deleting phase, check logs for more details");
  }
}
