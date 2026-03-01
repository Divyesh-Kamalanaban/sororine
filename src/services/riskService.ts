/**
 * Risk Analysis Service
 * Centralized business logic for calculating safety risk scores
 */

import { Incident, RiskAnalysis, RiskLevel, RiskFactors } from '@/types';

// Risk weights by incident category
const INCIDENT_WEIGHTS: Record<string, number> = {
  'rape': 50,
  'sexual assault': 50,
  'assault': 40,
  'harassment': 30,
  'stalking': 25,
  'robbery': 20,
  'theft': 15,
  'eve teasing': 20,
  'domestic violence': 35,
  'poor lighting': 15,
  'unsafe crowding': 15,
  'other': 10,
};

const TIME_PERIODS = {
  morning: { start: 6, end: 12 },    // 6 AM - 12 PM
  afternoon: { start: 12, end: 18 }, // 12 PM - 6 PM
  evening: { start: 18, end: 21 },   // 6 PM - 9 PM
  night: { start: 21, end: 6 },      // 9 PM - 6 AM (next day)
};

const TIME_MULTIPLIERS = {
  morning: 0.8,
  afternoon: 0.9,
  evening: 1.2,
  night: 1.5,     // Night hours are higher risk
};

/**
 * Categorize incident by time of day
 */
export function getTimePeriod(date: Date): keyof typeof TIME_PERIODS {
  const hour = date.getHours();
  
  if (hour >= TIME_PERIODS.morning.start && hour < TIME_PERIODS.morning.end) {
    return 'morning';
  } else if (hour >= TIME_PERIODS.afternoon.start && hour < TIME_PERIODS.afternoon.end) {
    return 'afternoon';
  } else if (hour >= TIME_PERIODS.evening.start && hour < TIME_PERIODS.evening.end) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Get weight for incident category with fuzzy matching
 */
export function getCategoryWeight(category: string): number {
  const normalized = (category || 'other').toLowerCase();
  
  // Direct match
  if (INCIDENT_WEIGHTS[normalized]) {
    return INCIDENT_WEIGHTS[normalized];
  }
  
  // Partial match
  for (const [key, weight] of Object.entries(INCIDENT_WEIGHTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return weight;
    }
  }
  
  return INCIDENT_WEIGHTS['other'];
}

/**
 * Apply time decay - recent incidents are weighted more heavily
 */
export function applyTimeDecay(incidentDate: Date, daysBack: number): number {
  const now = new Date();
  const ageInDays = (now.getTime() - incidentDate.getTime()) / (24 * 60 * 60 * 1000);
  
  if (ageInDays > daysBack) {
    return 0; // Incident older than threshold
  }
  
  // Linear decay: older incidents get lower weight
  return 1 - (ageInDays / daysBack) * 0.5;
}

/**
 * Main risk score calculation algorithm
 * Combines multiple factors into a single 0-100 risk score
 */
export function calculateRiskScore(
  incidents: Incident[],
  datasetScore: number = 0
): RiskAnalysis {
  if (incidents.length === 0 && datasetScore === 0) {
    return {
      score: 0,
      level: 'LOW',
      factors: {
        totalIncidents: 0,
        recentIncidents: 0,
        timeDistribution: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      },
    };
  }

  const now = new Date();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
  const DECAY_WINDOW_DAYS = 30; // Consider incidents within 30 days

  let incidentScore = 0;
  let recentCount = 0;
  const timeDistribution: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  // Process each incident
  incidents.forEach((incident) => {
    const weight = getCategoryWeight(incident.category);
    const timePeriod = getTimePeriod(incident.timestamp);
    const timeMultiplier = TIME_MULTIPLIERS[timePeriod];
    const decayFactor = applyTimeDecay(incident.timestamp, DECAY_WINDOW_DAYS);
    
    if (decayFactor > 0) {
      const weightedScore = weight * timeMultiplier * decayFactor;
      incidentScore += weightedScore;

      // Track time distribution
      timeDistribution[timePeriod]++;

      // Count incidents within 7 days
      if (now.getTime() - incident.timestamp.getTime() <= SEVEN_DAYS_MS) {
        recentCount++;
      }
    }
  });

  // Normalize incident score (cap at 50 for this component)
  const normalizedIncidentScore = Math.min(incidentScore / incidents.length, 50);

  // Combine incident score (50%) + dataset score (50%)
  const finalScore = (normalizedIncidentScore * 0.5) + (datasetScore * 0.5);

  // Cap at 100
  const cappedScore = Math.min(finalScore, 100);

  // Determine risk level
  const riskLevel = getRiskLevel(cappedScore);

  return {
    score: Math.round(cappedScore * 10) / 10, // Round to 1 decimal
    level: riskLevel,
    factors: {
      totalIncidents: incidents.length,
      recentIncidents: recentCount,
      timeDistribution,
    },
  };
}

/**
 * Map numeric score to risk level category
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
}

/**
 * Generate alert messages based on risk analysis
 */
export function generateAlerts(analysis: RiskAnalysis, state: string): string[] {
  const alerts: string[] = [];

  if (analysis.level === 'CRITICAL') {
    alerts.push('⚠️ CRITICAL RISK: Avoid this area if possible. Stay alert and connected.');
  } else if (analysis.level === 'HIGH') {
    alerts.push('⚠️ HIGH RISK: Exercise caution. Consider alternative routes.');
  } else if (analysis.level === 'MODERATE') {
    alerts.push('⚠️ MODERATE RISK: Be aware of your surroundings.');
  }

  if (analysis.factors.recentIncidents > 5) {
    alerts.push(`🚨 Multiple recent incidents (${analysis.factors.recentIncidents}) in this area.`);
  }

  if (analysis.factors.timeDistribution.night > analysis.factors.timeDistribution.morning) {
    alerts.push('🌙 Most incidents occur at night. Avoid traveling alone after dark.');
  }

  if (state && state !== 'Unknown') {
    alerts.push(`📍 State-level risk (${state}): Monitor local news for updates.`);
  }

  return alerts;
}
