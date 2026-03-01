/**
 * Application Constants
 * Centralized configuration and hardcoded values
 */

// ============ Geographic Constants ============
export const GEO = {
  EARTH_RADIUS_KM: 6371,
  KM_PER_DEGREE_LAT: 111,
  DEFAULT_SEARCH_RADIUS_KM: 5,
  INCIDENT_MAP_RADIUS_KM: 2,
  NEARBY_USERS_RADIUS_KM: 5,
} as const;

// ============ Risk Scoring Constants ============
export const RISK = {
  DECAY_WINDOW_DAYS: 30,
  RECENT_INCIDENT_DAYS: 7,
  INCIDENT_WEIGHT_CAP: 50,
  DATASET_WEIGHT: 0.5,
  INCIDENT_SCORE_WEIGHT: 0.5,
  SCORE_PRECISION: 1, // Round to 1 decimal place
  SCORE_MAX: 100,
  MIN_SCORE_CRITICAL: 70,
  MIN_SCORE_HIGH: 50,
  MIN_SCORE_MODERATE: 30,
} as const;

// ============ Time Periods ============
export const TIME_PERIODS = {
  MORNING_START: 6,
  MORNING_END: 12,
  AFTERNOON_START: 12,
  AFTERNOON_END: 18,
  EVENING_START: 18,
  EVENING_END: 21,
  NIGHT_START: 21,
  NIGHT_END: 6,
} as const;

// ============ Session & Auth ============
export const AUTH = {
  SESSION_EXPIRY_DAYS: 7,
  PASSWORD_HASH_ROUNDS: 10,
  JWT_ALGORITHM: 'HS256',
  COOKIE_NAME: 'auth_token',
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: 'lax',
} as const;

// ============ API Pagination ============
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 500,
  DEFAULT_INCIDENTS_LIMIT: 500,
} as const;

// ============ Feature Flags ============
export const FEATURES = {
  ENABLE_REAL_TIME_ALERTS: true,
  ENABLE_PEER_HELP: true,
  ENABLE_INCIDENT_REPORTING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_MESSAGING: true,
  ENABLE_OFFLINE_MODE: false, // Future enhancement
} as const;

// ============ Rate Limiting (Future) ============
export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  INCIDENT_REPORTS_PER_HOUR: 10,
  HELP_REQUESTS_PER_HOUR: 5,
  MESSAGES_PER_MINUTE: 30,
} as const;

// ============ Error Messages ============
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  INVALID_TOKEN: 'Invalid or expired session',
  LOCATION_REQUIRED: 'Location permissions required',
  MISSING_FIELDS: 'Missing required fields',
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
} as const;

// ============ Success Messages ============
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully',
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  INCIDENT_REPORTED: 'Incident reported successfully',
  HELP_REQUESTED: 'Help request activated',
  HELP_OFFER_SENT: 'Help offer sent',
  MESSAGE_SENT: 'Message sent',
} as const;

// ============ Incident Categories ============
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
  'Other',
] as const;

// ============ Toast Notification Duration ============
export const TOAST = {
  DEFAULT_DURATION_MS: 4000,
  ERROR_DURATION_MS: 5000,
  SUCCESS_DURATION_MS: 3000,
} as const;

// ============ UI Constants ============
export const UI = {
  SIDEBAR_WIDTH_EXPANDED_PX: 256,
  SIDEBAR_WIDTH_COLLAPSED_PX: 80,
  MODAL_ANIMATION_DURATION_MS: 300,
  MAP_ZOOM_DEFAULT: 13,
  MAP_ZOOM_MIN: 10,
  MAP_ZOOM_MAX: 18,
} as const;

// ============ Database Constraints ============
export const DB = {
  STRING_MAX_LENGTH: 255,
  TEXT_MAX_LENGTH: 5000,
  PHONE_LENGTH: 10,
  EMAIL_MAX_LENGTH: 255,
} as const;
