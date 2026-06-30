import type { CurrentSighting, ParkWeather } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API-Fehler ${response.status} bei ${path}`);
  }
  return response.json() as Promise<T>;
}

export function getCurrentSighting(): Promise<CurrentSighting | null> {
  return request("/api/sightings/current");
}

export function createSighting(lat: number, lng: number): Promise<CurrentSighting> {
  return request("/api/sightings", {
    method: "POST",
    body: JSON.stringify({ lat, lng }),
  });
}

export function confirmSighting(id: string): Promise<CurrentSighting> {
  return request(`/api/sightings/${id}/confirm`, { method: "POST" });
}

export function getWeather(): Promise<ParkWeather> {
  return request("/api/weather");
}
