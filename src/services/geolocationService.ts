/**
 * Geolocation Service
 * Business logic for reverse geocoding and location data handling
 */

import { GeoLocation } from '@/types';

interface GeoAddress {
  state?: string;
  region?: string;
  county?: string;
  country?: string;
  [key: string]: string | undefined;
}

interface NominatimResponse {
  address?: GeoAddress;
  [key: string]: any;
}

/**
 * Reverse geocode coordinates to get state/region name
 * Uses OpenStreetMap Nominatim API (free, requires User-Agent)
 */
export async function reverseGeocode(
  location: GeoLocation
): Promise<{ state: string; country: string }> {
  const { lat, lng } = location;

  // Validate coordinates
  if (lat === 0 && lng === 0) {
    return { state: 'Unknown', country: 'Unknown' };
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Sororine/1.0 (Women Safety App)',
        },
      }
    );

    if (!response.ok) {
      console.warn('[GeolocationService] Nominatim API returned non-OK status');
      return { state: 'Unknown', country: 'Unknown' };
    }

    const data: NominatimResponse = await response.json();
    const address = data.address || {};

    // Extract state/region (varies by country naming conventions)
    const state = address.state || address.region || address.county || 'Unknown';
    const country = address.country || 'Unknown';

    return { state, country };
  } catch (error) {
    console.error('[GeolocationService] Reverse geocoding failed:', error);
    // Return unknown instead of throwing to prevent cascading failures
    return { state: 'Unknown', country: 'Unknown' };
  }
}

/**
 * Validate GPS coordinates
 */
export function validateCoordinates(location: GeoLocation): boolean {
  const { lat, lng } = location;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  if (lng < -180 || lng > 180) {
    return false;
  }

  // Reject exact 0,0 (likely error/mock location)
  if (lat === 0 && lng === 0) {
    return false;
  }

  return true;
}

/**
 * Calculate bounding box for a radius around a point
 * Useful for spatial queries
 */
export function getBoundingBox(
  location: GeoLocation,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const radiusDegrees = radiusKm / 111; // 1 degree ≈ 111km

  return {
    minLat: location.lat - radiusDegrees,
    maxLat: location.lat + radiusDegrees,
    minLng: location.lng - radiusDegrees,
    maxLng: location.lng + radiusDegrees,
  };
}

/**
 * Calculate bearing (direction) from one point to another
 * Returns angle in degrees (0-360) where 0 = North
 */
export function calculateBearing(
  from: GeoLocation,
  to: GeoLocation
): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = Math.atan2(x, y);
  const degrees = (bearing * 180) / Math.PI;

  // Normalize to 0-360
  return (degrees + 360) % 360;
}

/**
 * Get cardinal direction from bearing angle
 */
export function getBearingDirection(bearing: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(location: GeoLocation): string {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
}

/**
 * Get common location names (e.g., well-known areas/landmarks in major Indian cities)
 * Can be extended for other regions
 */
export function getLocationAlias(state: string): string {
  const aliases: Record<string, string> = {
    'Delhi': 'NCT OF DELHI',
    'NCT of Delhi': 'NCT OF DELHI',
    'Jammu and Kashmir': 'JAMMU & KASHMIR',
    'Dadra and Nagar Haveli': 'D&N HAVELI',
    'Daman and Diu': 'DAMAN AND DIU',
  };

  return aliases[state] || state;
}
