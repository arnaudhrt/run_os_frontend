import type { CreateSeasonModel, SeasonModel } from "../models/season.model";

export async function getActiveSeason({ token }: { token: string }): Promise<SeasonModel | null> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/seasons`);

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

export async function createSeason({ body, token }: { body: CreateSeasonModel; token: string }): Promise<void> {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/seasons/season`);
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
