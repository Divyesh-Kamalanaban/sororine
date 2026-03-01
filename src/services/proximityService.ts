import { prisma } from "@/lib/prisma";

export async function getNearbyHelpers(lat: number, lng: number, radiusMeters: number) {
  // Uses PostGIS spatial indexing for sub-millisecond lookups
  return await prisma.$queryRaw`
    SELECT id, "userId", lat, lng 
    FROM "UserLocation"
    WHERE ST_DWithin(
      location_geog, 
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, 
      ${radiusMeters}
    )
    AND "helpRequestedAt" IS NULL; -- Finding helpers, not other victims
  `;
}
