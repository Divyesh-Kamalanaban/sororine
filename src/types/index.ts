/**
 * Shared TypeScript types and interfaces
 * Central location for all data structures used across the application
 */

// ============ User Types ============
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

// ============ Location Types ============
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface UserLocation extends GeoLocation {
  id: string;
  helpRequestedAt: Date | null;
  lastUpdated: Date;
  userId: string | null;
}

export interface NearbyUser extends UserLocation {
  name: string;
  distance?: number; // calculated distance in km
}

// ============ Incident Types ============
export const INCIDENT_CATEGORIES = [
  'Harassment',
  'Stalking',
  'Assault',
  'Sexual Assault',
  'Robbery',
  'Theft',
  'Eve Teasing',
  'Unsafe Crowding',
  'Poor Lighting',
  'Other'
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export interface Incident {
  id: number;
  lat: number;
  lng: number;
  category: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  timestamp: Date;
  userId: string | null;
  user?: any;
}

export interface CreateIncidentPayload {
  lat: number;
  lng: number;
  category: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  timestamp?: Date;
}

// ============ Risk Analysis Types ============
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskFactors {
  totalIncidents: number;
  recentIncidents: number;
  timeDistribution: Record<'morning' | 'afternoon' | 'evening' | 'night', number>;
}

export interface RiskAnalysis {
  score: number; // 0-100
  level: RiskLevel;
  factors: RiskFactors;
}

export interface RiskData {
  riskScore: number;
  riskLevel: RiskLevel;
  incidents: Incident[];
  alerts: string[];
  datasetScore: number;
  detectedState: string;
}

// ============ Help & Offer Types ============
export type HelpStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface HelpOffer {
  id: string;
  requesterId: string;
  helperId: string;
  status: HelpStatus;
  createdAt: Date;
}

export interface CreateHelpOfferPayload {
  requesterId: string;
  helperId: string;
  name: string;
}

// ============ Message Types ============
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

export interface CreateMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: any;
}

// ============ Pagination Types ============
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
