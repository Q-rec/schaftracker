const PARK_LAT = process.env.PARK_LAT ?? "52.5208";
const PARK_LNG = process.env.PARK_LNG ?? "13.2957";
const CACHE_MS = 10 * 60 * 1000;

export type WeatherCondition = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export interface ParkWeather {
  temperatureC: number;
  condition: WeatherCondition;
}

let cached: (ParkWeather & { fetchedAt: number }) | null = null;

function conditionFromWeatherCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return "snow";
  if (code === 80 || code === 81 || code === 82) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

export async function getParkWeather(): Promise<ParkWeather> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return { temperatureC: cached.temperatureC, condition: cached.condition };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${PARK_LAT}&longitude=${PARK_LNG}&current=temperature_2m,weather_code`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }
  const data = (await response.json()) as { current: { temperature_2m: number; weather_code: number } };
  const temperatureC = Math.round(data.current.temperature_2m);
  const condition = conditionFromWeatherCode(data.current.weather_code);

  cached = { temperatureC, condition, fetchedAt: Date.now() };
  return { temperatureC, condition };
}
