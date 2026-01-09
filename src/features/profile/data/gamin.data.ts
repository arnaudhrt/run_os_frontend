export async function connectToGarmin({ token }: { token: string }) {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/garmin/connect`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error connecting to garmin, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function disconnectFromGarmin({ token }: { token: string }) {
  const url = new URL(`${import.meta.env.VITE_API_URL}/v1/garmin/disconnect`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Error disconnecting from garmin, check logs for more details");
  }
  const responseData = await response.json();

  return responseData.data;
}

export async function syncGarminActivities({ token }: { token: string }): Promise<void> {
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
