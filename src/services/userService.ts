/**
 * User Service
 * Business logic for user management, location tracking, and help requests
 */

import { prisma } from '@/lib/prisma';
import { GeoLocation, NearbyUser } from '@/types';

const NEARBY_RADIUS_KM = 5;
const ROUGH_RADIUS_DEGREES = NEARBY_RADIUS_KM / 111; // 1 degree lat ≈ 111 km

/**
 * Calculate distance between two geographic points (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Update user's current location
 */
export async function updateUserLocation(
  id: string,
  location: GeoLocation
): Promise<void> {
  try {
    await prisma.userLocation.upsert({
      where: { id },
      update: {
        lat: location.lat,
        lng: location.lng,
      },
      create: {
        id,
        lat: location.lat,
        lng: location.lng,
      },
    });
  } catch (error) {
    console.error('[UserService] Failed to update location:', error);
    throw new Error('Failed to update location');
  }
}

/**
 * Get nearby users within radius, excluding self and those not requesting help
 */
export async function getNearbyUsers(
  userLocation: GeoLocation,
  userId: string,
  radiusKm: number = NEARBY_RADIUS_KM
): Promise<NearbyUser[]> {
  try {
    const radiusDegrees = radiusKm / 111;

    // Get users in bounding box
    const nearbyUsers = await prisma.userLocation.findMany({
      where: {
        id: { not: userId }, // Exclude self
        helpRequestedAt: { not: null }, // Only those requesting help
        lat: {
          gte: userLocation.lat - radiusDegrees,
          lte: userLocation.lat + radiusDegrees,
        },
        lng: {
          gte: userLocation.lng - radiusDegrees,
          lte: userLocation.lng + radiusDegrees,
        },
      },
    });

    // Calculate distance and filter within exact radius
    const filtered = nearbyUsers.filter((user) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        user.lat,
        user.lng
      );
      return distance <= radiusKm;
    });

    // Add distance and name (mock for now, would join with User table)
    return filtered.map((user) => ({
      ...user,
      name: `User ${user.id.substring(0, 6)}`, // Placeholder
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        user.lat,
        user.lng
      ),
    }));
  } catch (error) {
    console.error('[UserService] Failed to get nearby users:', error);
    throw new Error('Failed to fetch nearby users');
  }
}

/**
 * Set or unset active help request for user
 */
export async function setHelpRequest(id: string, active: boolean): Promise<void> {
  try {
    if (active) {
      // Activate help request
      await prisma.userLocation.upsert({
        where: { id },
        update: { helpRequestedAt: new Date() },
        create: {
          id,
          lat: 0,
          lng: 0,
          helpRequestedAt: new Date(),
        },
      });
    } else {
      // Deactivate help request and clean up associated data
      await prisma.$transaction([
        prisma.userLocation.update({
          where: { id },
          data: { helpRequestedAt: null },
        }),
        prisma.helpOffer.deleteMany({
          where: { requesterId: id },
        }),
        prisma.message.deleteMany({
          where: {
            OR: [{ senderId: id }, { receiverId: id }],
          },
        }),
      ]);
    }
  } catch (error) {
    console.error('[UserService] Failed to set help request:', error);
    throw new Error('Failed to update help request status');
  }
}

/**
 * Get pending help offers for a requester
 */
export async function getPendingOffers(requesterId: string) {
  try {
    return await prisma.helpOffer.findMany({
      where: {
        requesterId,
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[UserService] Failed to get pending offers:', error);
    throw new Error('Failed to fetch help offers');
  }
}

/**
 * Create help offer from helper to requester
 */
export async function createHelpOffer(
  requesterId: string,
  helperId: string
): Promise<any> {
  try {
    return await prisma.helpOffer.create({
      data: {
        requesterId,
        helperId,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('[UserService] Failed to create help offer:', error);
    throw new Error('Failed to create help offer');
  }
}

/**
 * Accept help offer
 */
export async function acceptHelpOffer(offerId: string): Promise<void> {
  try {
    await prisma.helpOffer.update({
      where: { id: offerId },
      data: { status: 'ACCEPTED' },
    });
  } catch (error) {
    console.error('[UserService] Failed to accept help offer:', error);
    throw new Error('Failed to accept help offer');
  }
}

/**
 * Reject help offer
 */
export async function rejectHelpOffer(offerId: string): Promise<void> {
  try {
    await prisma.helpOffer.delete({
      where: { id: offerId },
    });
  } catch (error) {
    console.error('[UserService] Failed to reject help offer:', error);
    throw new Error('Failed to reject help offer');
  }
}
