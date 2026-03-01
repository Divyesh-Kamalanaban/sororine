/**
 * Incident Service
 * Business logic for incident reporting and retrieval
 */

import { prisma } from '@/lib/prisma';
import { Incident, CreateIncidentPayload, GeoLocation } from '@/types';
import { CreateIncidentSchema } from '@/validations/incident.schema';
import { emitEvent, EVENTS } from '@/lib/eventEmitter';

/**
 * Fetch incidents with optional limiting
 */
export async function getIncidents(limit?: number): Promise<Incident[]> {
  try {
    return (await prisma.incident.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit || 500,
    })) as Incident[];
  } catch (error) {
    console.error('[IncidentService] Failed to fetch incidents:', error);
    throw new Error('Failed to fetch incidents');
  }
}

/**
 * Get incidents within a radius of a location
 * Uses simple bounding box filtering (SQLite limitation)
 */
export async function getIncidentsNearLocation(
  location: GeoLocation,
  radiusKm: number = 2  // ~2km radius default
): Promise<Incident[]> {
  try {
    const radiusDegrees = radiusKm / 111; // 1 degree ≈ 111km

    return (await prisma.incident.findMany({
      where: {
        lat: {
          gte: location.lat - radiusDegrees,
          lte: location.lat + radiusDegrees,
        },
        lng: {
          gte: location.lng - radiusDegrees,
          lte: location.lng + radiusDegrees,
        },
      },
      orderBy: { timestamp: 'desc' },
    })) as Incident[];
  } catch (error) {
    console.error('[IncidentService] Failed to get nearby incidents:', error);
    throw new Error('Failed to fetch nearby incidents');
  }
}

/**
 * Get recent incidents (within last N days)
 */
export async function getRecentIncidents(daysBack: number = 7): Promise<Incident[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return (await prisma.incident.findMany({
      where: {
        timestamp: {
          gte: cutoffDate,
        },
      },
      orderBy: { timestamp: 'desc' },
    })) as Incident[];
  } catch (error) {
    console.error('[IncidentService] Failed to get recent incidents:', error);
    throw new Error('Failed to fetch recent incidents');
  }
}

/**
 * Create a new incident report
 */
export async function createIncident(
  payload: CreateIncidentPayload
): Promise<Incident> {
  // Zod validation
  const validated = CreateIncidentSchema.parse(payload);
  const { lat, lng, category, description, location, imageUrl } = validated;

  if (!category || category.trim().length === 0) {
    throw new Error('Category is required');
  }

  try {
    const incident = await prisma.incident.create({
      data: {
        lat,
        lng,
        category: category.trim(),
        description: description?.trim(),
        location: location?.trim(),
        imageUrl,
        timestamp: payload.timestamp || new Date(),
      },
    });

    // Emit event for SSE subscribers
    emitEvent(EVENTS.INCIDENT_CREATED, incident);

    return incident as Incident;
  } catch (error) {
    console.error('[IncidentService] Failed to create incident:', error);
    throw new Error('Failed to create incident');
  }
}

/**
 * Delete an incident (admin/mod function)
 */
export async function deleteIncident(id: number): Promise<boolean> {
  try {
    await prisma.incident.delete({
      where: { id },
    });

    // Emit event for SSE subscribers
    emitEvent(EVENTS.INCIDENT_DELETED, { id });

    return true;
  } catch (error) {
    console.error('[IncidentService] Failed to delete incident:', error);
    throw new Error('Failed to delete incident');
  }
}

/**
 * Get statistics about incidents
 */
export async function getIncidentStatistics(): Promise<{
  totalIncidents: number;
  recentIncidents: number;
  topCategories: Array<{ category: string; count: number }>;
}> {
  try {
    const total = await prisma.incident.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await prisma.incident.count({
      where: {
        timestamp: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get top categories by count
    const incidents = await prisma.incident.findMany({
      select: { category: true },
    });

    const categoryCount: Record<string, number> = {};
    incidents.forEach((incident) => {
      const cat = incident.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalIncidents: total,
      recentIncidents: recent,
      topCategories,
    };
  } catch (error) {
    console.error('[IncidentService] Failed to get statistics:', error);
    throw new Error('Failed to get incident statistics');
  }
}

/**
 * Get incidents by category
 */
export async function getIncidentsByCategory(category: string): Promise<Incident[]> {
  try {
    return (await prisma.incident.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive', // Case-insensitive
        },
      },
      orderBy: { timestamp: 'desc' },
    })) as Incident[];
  } catch (error) {
    console.error('[IncidentService] Failed to get incidents by category:', error);
    throw new Error('Failed to fetch incidents by category');
  }
}
