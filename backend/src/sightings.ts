import { prisma } from "./prisma.js";
import { daysSince, statusForDaysAgo, uncertainLabel, type SightingStatus } from "./status.js";

export interface CurrentSightingResponse {
  id: string;
  lat: number;
  lng: number;
  createdAt: string;
  confirmCount: number;
  status: SightingStatus;
  daysAgo: number;
  uncertainLabel: string | null;
}

export async function getCurrentSighting(): Promise<CurrentSightingResponse | null> {
  const sighting = await prisma.sighting.findFirst({
    orderBy: { createdAt: "desc" },
    include: { confirmations: { orderBy: { createdAt: "desc" }, take: 1 }, _count: { select: { confirmations: true } } },
  });

  if (!sighting) return null;

  const lastActivity = sighting.confirmations[0]?.createdAt ?? sighting.createdAt;
  const daysAgo = daysSince(lastActivity);
  const status = statusForDaysAgo(daysAgo);

  return {
    id: sighting.id,
    lat: sighting.lat,
    lng: sighting.lng,
    createdAt: sighting.createdAt.toISOString(),
    confirmCount: sighting._count.confirmations,
    status,
    daysAgo,
    uncertainLabel: status === "uncertain" ? uncertainLabel(daysAgo) : null,
  };
}
