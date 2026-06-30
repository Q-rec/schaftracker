import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "./prisma.js";
import { getCurrentSighting } from "./sightings.js";
import { getParkWeather } from "./weather.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

// Railway (and most hosting platforms) sit behind a reverse proxy, so trust
// the X-Forwarded-For header for correct client IPs in rate limiting.
app.set("trust proxy", 1);
const frontendOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: frontendOrigins }));
app.use(express.json());

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/sightings/current", async (_req, res) => {
  const current = await getCurrentSighting();
  res.json(current);
});

app.post("/api/sightings", writeLimiter, async (req, res) => {
  const { lat, lng } = req.body ?? {};

  if (typeof lat !== "number" || typeof lng !== "number") {
    res.status(400).json({ error: "lat und lng (number) sind erforderlich" });
    return;
  }

  const sighting = await prisma.sighting.create({ data: { lat, lng } });
  await prisma.confirmation.create({ data: { sightingId: sighting.id } });

  const current = await getCurrentSighting();
  res.status(201).json(current);
});

app.post("/api/sightings/:id/confirm", writeLimiter, async (req, res) => {
  const { id } = req.params;

  const sighting = await prisma.sighting.findUnique({ where: { id } });
  if (!sighting) {
    res.status(404).json({ error: "Sichtung nicht gefunden" });
    return;
  }

  await prisma.confirmation.create({ data: { sightingId: id } });

  const current = await getCurrentSighting();
  res.json(current);
});

app.get("/api/weather", async (_req, res) => {
  try {
    const weather = await getParkWeather();
    res.json(weather);
  } catch (error) {
    res.status(502).json({ error: "Wetterdaten konnten nicht geladen werden" });
  }
});

app.listen(port, () => {
  console.log(`SchafTracker backend läuft auf http://localhost:${port}`);
});
