export function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function formatPace(paceMinPerKm: number | undefined): string {
  if (!paceMinPerKm) return "-";
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}

export function formatElevation(meters: number): string {
  return `${meters} m`;
}

export function formatHeartRate(bpm: number | undefined): string {
  if (!bpm) return "-";
  return `${bpm} bpm`;
}

export function formatAvgMaxHR(avg: number | undefined, max: number | undefined): string {
  if (!avg) return "-";
  if (!max) return `${avg} bpm`;
  return `${avg}/${max} bpm`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatWorkoutType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
