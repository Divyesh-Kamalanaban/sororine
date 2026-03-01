# Sororine - Codebase Documentation

## Project Overview
Sororine is a real-time safety intelligence platform for women travelers. It provides risk analysis, incident reporting, location tracking, peer-to-peer help requests, and community safety features.

---

## 🏗️ Architecture & Design Principles

### Layered Architecture
The application is organized into clean, separated layers for maintainability and testability:

```
┌─────────────────────────────────────────────┐
│     Pages (Next.js routes)                  │
│  Landing, Dashboard, Reports, etc.          │
└─────────────────────────────────────────────┘
              ↓ Uses
┌─────────────────────────────────────────────┐
│     Components (React UI)                   │
│  Sidebar, Map, Modals, Forms                │
└─────────────────────────────────────────────┘
              ↓ Uses
┌─────────────────────────────────────────────┐
│     Services (Business Logic)               │
│  Risk, User, Message, Incident, Location   │
│  ⚠️ PURE FUNCTIONS - No side effects       │
└─────────────────────────────────────────────┘
              ↓ Uses
┌─────────────────────────────────────────────┐
│     Data Layer (API Routes)                 │
│  /api/auth, /api/incidents, /api/users      │
└─────────────────────────────────────────────┘
              ↓ Uses
┌─────────────────────────────────────────────┐
│     Database (Prisma + SQLite)              │
│  User, Incident, Message, HelpOffer tables │
└─────────────────────────────────────────────┘
```

### Key Design Principles

1. **Separation of Concerns**
   - **Services**: Pure business logic without dependencies
   - **Components**: UI presentation only
   - **API Routes**: Accept requests → Call services → Return responses
   - **Types**: Single source of truth for data structures

2. **Reusability**
   - Services can be imported in multiple API routes or components
   - No code duplication between different endpoints
   - Shared types prevent type mismatches

3. **Testability**
   - Services contain no Next.js-specific code
   - Business logic can be unit tested independently
   - Mocking dependencies becomes straightforward

4. **Maintainability**
   - Constants centralized in one location
   - Clear function names and documentation
   - Related functions grouped in service files

---

## Project Overview
Sororine is a real-time safety intelligence platform for women travelers. It provides risk analysis, incident reporting, location tracking, peer-to-peer help requests, and community safety features.

---

## 📁 Directory Structure & Architecture Overview

### Core Project Layout
```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React UI components (presentation layer)
├── services/         # Business logic layer (modular services)
├── types/            # TypeScript interfaces and types
├── constants/        # Application configuration and constants
├── lib/              # Utility functions and database client
├── hooks/            # Custom React hooks
├── python/           # Data processing scripts
├── validations/      # Input validation schemas (future)
└── middleware.ts     # Next.js middleware
```

---

## 🎨 Components (`src/components/`)

### Page/Layout Components

| Component | Location | Purpose | Key Props/State |
|-----------|----------|---------|-----------------|
| **Sidebar** | `Sidebar.tsx` | Navigation sidebar with user profile & logout | `collapsed`, `isMobileOpen`, `user` |
| **GlobalFilters** | `GlobalFilters.tsx` | Time range and category filters for data | `onFilterChange`, `dateRange`, `categories` |
| **Chat** | `Chat.tsx` | Real-time messaging between helpers & requesters | `partnerId`, `messages`, `onSendMessage` |
| **Map** | `Map.tsx` | Leaflet map showing incidents, user location, nearby users | `incidents`, `userLocation`, `nearbyUsers`, `onIncidentClick` |
| **MapWrapper** | `MapWrapper.tsx` | Wrapper for dynamic Map import (SSR workaround) | `children` |
| **MapSearch** | `MapSearch.tsx` | Search bar for location-based queries | `onSearch`, `onLocationSelect` |

### Modal Components

| Component | Location | Purpose | Triggers |
|-----------|----------|---------|----------|
| **ReportIncidentModal** | `ReportIncidentModal.tsx` | Form to report safety incidents | User clicks "Report Incident" button |
| **IncidentDetailsModal** | `IncidentDetailsModal.tsx` | Display details of clicked incident | User clicks incident marker on map |
| **HelpModal** | `HelpModal.tsx` | Request help SOS interface | User clicks "Need Help?" button |
| **OfferHelpModal** | `OfferHelpModal.tsx` | Interface to offer help to nearby users | User clicks "Offer Help" button |

### Analytics Components

| Component | Location | Purpose | Data Source |
|-----------|----------|---------|------------|
| **KPICard** | `KPICard.tsx` | Displays key performance indicators | Risk score, incident count |
| **AnalyticsWidget** | `AnalyticsWidget.tsx` | Charts and statistics visualization | Incident trends, time distribution |
| **ReportForm** | `ReportForm.tsx` | Form to submit incident reports | Form submission to `/api/incidents` |

---

## 📄 Pages (`src/app/`)

| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Landing Page** | `/` | Public homepage with feature showcase | Hero, CTAs, feature grid |
| **Login** | `/login` | User authentication | Email/password login |
| **Register** | `/register` | New user account creation | Form validation, password hashing |
| **Dashboard** | `/dashboard` | Main authenticated application | Map, analytics, help system |
| **Reports** | `/reports` | View user's submitted incidents | Filter, pagination |
| **History** | `/history` | View past help requests & accepted help | Timeline view |
| **Alerts** | `/alerts` | Real-time safety alerts | Push notifications |
| **Settings** | `/settings` | User profile & preferences | Emergency contact, privacy settings |

---

## 🔌 API Routes (`src/app/api/`)

### Authentication Routes

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/auth/login` | POST | Authenticate user with email/password | `{ email, password }` | `{ id, email, name }` / Error |
| `/api/auth/register` | POST | Create new user account | `{ email, password, name, phone, emergencyContact }` | `{ id, email }` / Error |
| `/api/auth/logout` | POST | Clear session cookie | - | `{ success: true }` |
| `/api/auth/me` | GET | Get current authenticated user | - | `{ user: { id, email, name } }` / Error |

### Incident Routes

| Endpoint | Method | Purpose | Parameters | Response |
|----------|--------|---------|------------|----------|
| `/api/incidents` | GET | Fetch all incidents with optional limit | `?limit=500` | `[ { id, lat, lng, category, description, timestamp, ... } ]` |
| `/api/incidents` | POST | Report new incident | `{ lat, lng, category, description, imageUrl, location, timestamp }` | `{ ...incident, id }` |
| `/api/incidents` | DELETE | Delete incident | `?id=123` | `{ success: true }` |

### User Location Routes

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/users/location` | POST | Update user's current location | `{ id, lat, lng, userId }` | `{ success: true }` |
| `/api/users/nearby` | GET | Get nearby users within 5km radius | `?lat=...&lng=...&userId=...` | `[ { id, lat, lng, name, ...} ]` |
| `/api/users/update` | POST | Update user profile info | `{ id, name, phone, emergencyContact }` | `{ success: true }` |

### Help & Offers Routes

| Endpoint | Method | Purpose | Request/Response |
|----------|--------|---------|------------------|
| `/api/users/help` | POST | Set/unset active help request | `{ id, active }` → `{ success, status }` |
| `/api/users/help` | GET | Get pending help offers | `?requesterId=...` → `[ { offeredBy, status, ... } ]` |
| `/api/users/help/my-offers` | GET | Get offers user has made | `?helperId=...` → `[ ... ]` |
| `/api/users/help/offer` | POST | Submit help offer to requester | `{ requesterId, helperId, name }` → `{ success }` |
| `/api/users/help/pending-offers` | GET | Get pending offers waiting acceptance | `?requesterId=...` → `[ ... ]` |

### Messaging Routes

| Endpoint | Method | Purpose | Request/Response |
|----------|--------|---------|------------------|
| `/api/messages` | GET | Fetch messages between two users | `?user1=...&user2=...&after=...` → `{ messages: [ ... ] }` |
| `/api/messages` | POST | Send message to another user | `{ senderId, receiverId, content }` → `{ success, message }` |

### Risk Analysis Routes

| Endpoint | Method | Purpose | Parameters | Response |
|----------|--------|---------|------------|----------|
| `/api/risk-data` | GET | Calculate risk score for location | `?lat=...&lng=...` | `{ riskScore, riskLevel, incidents, alerts, datasetScore, detectedState }` |

---

## 🎯 Services Layer (`src/services/`)

**Purpose**: Centralized business logic separated from API routes and components. This layer contains pure, reusable functions for all major operations.

### Risk Service (`riskService.ts`)
Handles risk score calculation and analysis

**Key Functions**:
- `calculateRiskScore(incidents, datasetScore)` - Main algorithm combining incident analysis & state data
- `getTimePeriod(date)` - Categorize time as morning/afternoon/evening/night
- `getCategoryWeight(category)` - Get incident severity weight with fuzzy matching
- `applyTimeDecay(incidentDate, daysBack)` - Weight recent incidents higher
- `getRiskLevel(score)` - Map numeric score to risk level
- `generateAlerts(analysis, state)` - Create alert messages

### User Service (`userService.ts`)
Manages user location tracking and help request system

**Key Functions**:
- `updateUserLocation(id, location)` - Update user's GPS position
- `getNearbyUsers(location, userId)` - Find helpers within 5km radius
- `calculateDistance(lat1, lng1, lat2, lng2)` - Haversine distance formula
- `setHelpRequest(id, active)` - Activate/deactivate help request & cleanup
- `createHelpOffer(requesterId, helperId)` - Create help offer record
- `getPendingOffers(requesterId)` - Fetch pending offers for user
- `acceptHelpOffer(offerId)` - Accept help from a helper
- `rejectHelpOffer(offerId)` - Reject help offer

### Message Service (`messageService.ts`)
Handles peer-to-peer messaging between users

**Key Functions**:
- `getMessages(user1, user2, afterDate?)` - Fetch conversation history
- `sendMessage(payload)` - Create new message with validation
- `deleteMessage(messageId)` - Remove message
- `getUserChatCount(userId)` - Count unique chat partners
- `clearConversation(user1, user2)` - Clear entire conversation

### Incident Service (`incidentService.ts`)
Manages incident data and reporting

**Key Functions**:
- `getIncidents(limit?)` - Fetch all incidents
- `getIncidentsNearLocation(location, radius)` - Spatial query within radius
- `getRecentIncidents(daysBack)` - Time-based filtering
- `createIncident(payload)` - Report new incident with validation
- `deleteIncident(id)` - Remove incident
- `getIncidentStatistics()` - Get summary stats
- `getIncidentsByCategory(category)` - Filter by type

### Geolocation Service (`geolocationService.ts`)
Location-based operations and geocoding

**Key Functions**:
- `reverseGeocode(location)` - Coordinates → State/Country (Nominatim API)
- `validateCoordinates(location)` - Verify GPS coordinates validity
- `getBoundingBox(location, radiusKm)` - Calculate spatial bounds
- `calculateBearing(from, to)` - Get direction between points
- `getBearingDirection(bearing)` - Convert bearing to compass direction
- `formatCoordinates(location)` - Pretty-print coordinates
- `getLocationAlias(state)` - Normalize state names

---

## 🏷️ Types (`src/types/`)

**Purpose**: Centralized TypeScript interfaces and types for type safety across the entire application.

**Key Types Exported**:
- `UserProfile` - User account information
- `GeoLocation` - Coordinates with lat/lng
- `Incident`, `IncidentCategory` - Incident data structures
- `RiskAnalysis`, `RiskLevel` - Risk calculation results
- `HelpOffer`, `HelpStatus` - Help request system types
- `Message` - Chat message structure
- `ApiResponse<T>`, `ApiErrorResponse` - Standardized API responses
- `PaginatedResponse<T>` - Pagination wrapper

---

## ⚙️ Constants (`src/constants/`)

**Purpose**: Centralized configuration, hardcoded values, and feature flags.

**Categories**:
- `GEO` - Geographic calculations (Earth radius, default radii)
- `RISK` - Risk scoring weights and thresholds
- `TIME_PERIODS` - Hour ranges for morning/afternoon/evening/night
- `AUTH` - Session/JWT configuration
- `PAGINATION` - Default page sizes
- `FEATURES` - Feature flags for enabling/disabling functionality
- `ERROR_MESSAGES` - Standardized error strings
- `SUCCESS_MESSAGES` - Standardized success strings
- `INCIDENT_CATEGORIES` - Valid incident types
- `TOAST` - Notification duration settings
- `UI` - UI dimensions and animation timings
- `DB` - Database field constraints

---

## 📚 Libraries & Services (`src/lib/`)

### Authentication (`auth.ts`)
**Purpose**: JWT token management and password hashing

**Exported Functions**:
- `hashPassword(password: string)` → `Promise<string>` - Hash password with bcrypt
- `verifyPassword(password: string, hash: string)` → `Promise<boolean>` - Compare plain text with hash
- `signToken(payload: any)` → `Promise<string>` - Create JWT token (7 days expiry)
- `verifyToken(token: string)` → `Promise<any | null>` - Verify JWT token
- `getSession()` → `Promise<any | null>` - Get current session from cookies
- `setSession(token: string)` → `Promise<void>` - Set auth token in httpOnly cookie
- `clearSession()` → `Promise<void>` - Clear session cookie

### Risk Analysis (`risk.ts`)
**Purpose**: Calculate safety risk scores based on incidents and historical data

**Exported Types**:
- `RiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'`
- `RiskAnalysis { score, level, factors: { totalIncidents, recentIncidents, timeDistribution } }`

**Exported Functions**:
- `calculateRiskScore(incidents: Incident[], datasetScore?: number)` → `RiskAnalysis` - Main algorithm that:
  - Weighs incidents by category (rape: 50pts, harassment: 30pts, etc.)
  - Applies time decay (recent incidents scored higher)
  - Considers time of day (night incidents score higher)
  - Blends with state-level dataset score (20% weight)
  - Returns final score 0-100 and risk level

### Risk Dataset (`risk-dataset.ts`)
**Purpose**: State-level crime statistics for women safety

**Data**:
- `STATE_RISK_SCORES: Record<string, number>` - Risk scores for all 28 states/UTs
- **Function**: `getStateRiskScore(stateName: string)` → `number` - Fuzzy match state names and return score

**Top Risk States**: Uttar Pradesh (20.0), Madhya Pradesh (18.54), Maharashtra (17.65)

### Database (`prisma.ts`)
**Purpose**: Singleton Prisma client initialization

**Prisma Schema Models**:
- `User` - User accounts with authentication
- `UserLocation` - Current location tracking & help request status
- `Incident` - Reported safety incidents
- `HelpOffer` - Peer help offers
- `Message` - Chat messages between users

### Utilities (`utils.ts`)
**Purpose**: Small utility functions

**Exported Functions**:
- `cn(...inputs)` - Combining Tailwind CSS classes (clsx + twMerge)

---

## 🪝 Custom Hooks (`src/hooks/`)

| Hook | File | Purpose | Returns |
|------|------|---------|---------|
| **useLocation** | `useLocation.ts` | Get, track, and manage user's GPS location | `{ location: { lat, lng }, isLoading, error, retry, setLocation }` |

---

## 🔄 Data Models (Prisma Schema)

### User
Stores user authentication & profile information
```typescript
{
  id: String (PK)
  email: String (unique)
  password: String (hashed bcrypt)
  name: String
  phoneNumber: String
  emergencyContactName: String
  emergencyContactNumber: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### UserLocation
Tracks real-time location & help request status
```typescript
{
  id: String (PK)
  lat: Float
  lng: Float
  helpRequestedAt: DateTime? (null = no active help request)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Incident
Reported safety incidents/crimes
```typescript
{
  id: Int (PK, auto-increment)
  lat: Float
  lng: Float
  category: String (e.g., "Harassment", "Stalking")
  description: String?
  location: String?
  imageUrl: String?
  timestamp: DateTime
  createdAt: DateTime
}
```

### HelpOffer
Peer-to-peer help offers between users
```typescript
{
  id: Int (PK, auto-increment)
  requesterId: String (FK → UserLocation.id)
  offeredBy: String (helper's user ID)
  status: String ("pending", "accepted", "rejected")
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Message
Chat messages between users
```typescript
{
  id: Int (PK, auto-increment)
  senderId: String
  receiverId: String
  content: String
  createdAt: DateTime
}
```

---

## 🚦 Key Business Logic Flows

### 1. Risk Analysis Flow
```
User visits /dashboard
  ↓
useLocation hook gets GPS location
  ↓
GET /api/risk-data?lat=...&lng=...
  ↓
BackendRiskCalculation:
  1. Reverse geocode (Nominatim) to get state
  2. Fetch state risk score from dataset (20% weight)
  3. Fetch incidents within ~2km radius
  4. Weight incidents by category
  5. Apply time decay & time-of-day multiplier
  6. Calculate final risk 0-100 & level (LOW/MODERATE/HIGH/CRITICAL)
  ↓
Display on Dashboard with KPICard & AnalyticsWidget
```

### 2. Help Request Flow
```
User clicks "Need Help?"
  ↓
Opens HelpModal
  ↓
User activates help request
  ↓
POST /api/users/help { id, active: true }
  ↓
Nearby helpers see user in GET /api/users/nearby response
  ↓
Helper clicks "Offer Help"
  ↓
POST /api/users/help/offer { requesterId, helperId, name }
  ↓
HelpOffer record created (pending status)
  ↓
Requester sees pending offer in OfferHelpModal
  ↓
Requester accepts offer
  ↓
HelpOffer status → "accepted"
  ↓
Chat opens between requester & helper
  ↓
Messages exchanged via /api/messages
```

### 3. Incident Reporting Flow
```
User clicks "Report Incident"
  ↓
ReportIncidentModal opens
  ↓
User fills form (category, description, uploads image)
  ↓
POST /api/incidents { lat, lng, category, description, imageUrl, ... }
  ↓
Incident record created in database
  ↓
Incident appears on map for other users
  ↓
Risk scores recalculated for nearby users
```

---

## 📊 Authentication & Security

- **Password Hashing**: bcryptjs (10 rounds)
- **JWT Tokens**: JOSE library, 7-day expiration
- **Session Storage**: httpOnly secure cookies (CSRF protected via sameSite)
- **Auth Middleware**: `middleware.ts` checks token on protected routes

---

## 🌍 External APIs Used

| Service | Purpose | Endpoint |
|---------|---------|----------|
| **OpenStreetMap Nominatim** | Reverse geocoding (location → state) | `https://nominatim.openstreetmap.org/reverse` |
| **Leaflet** | Map rendering | Client-side library |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Next.js 15 (App Router), TypeScript |
| **Styling** | Tailwind CSS, PostCSS |
| **Database** | SQLite with Prisma ORM |
| **Auth** | JWT + bcryptjs |
| **Maps** | Leaflet + React-Leaflet |
| **Icons** | Lucide React |
| **Real-time** | Polling (short-interval GET requests) |

---

## 📝 Database Schema Relationships

```
User
  ↓
UserLocation (1:1 relationship, tracks location & help status)
  ↓
HelpOffer (1:many from UserLocation.requesterId)
  ↓
Message (many:many between any two user IDs)

Incident (independent, no FK relationships)
```

---

## 🔐 Protected Routes

All routes under `/dashboard/*` require valid JWT token in `auth_token` cookie:
- `/dashboard` - Main application
- `/reports` - User submitted incidents
- `/history` - Help request history
- `/alerts` - Notifications
- `/settings` - Profile management

Public routes:
- `/` - Landing page
- `/login` - Login page
- `/register` - Signup page

---

## 🎯 File Organization Best Practices Used

1. **Component Separation**: UI logic in components, business logic in lib
2. **Feature Grouping**: API routes organized by feature (auth, users, incidents)
3. **Type Safety**: TypeScript interfaces for all major data structures
4. **Environment Isolation**: Conditional imports (SSR vs client)
5. **Singleton Pattern**: Prisma client instantiation

---

## 📌 Known Limitations & Future Improvements

1. **Real-time**: Currently uses polling instead of WebSockets
2. **Geolocation**: Simple bounding box (~2km radius) instead of PostGIS spatial queries
3. **Scalability**: SQLite suitable for MVP; upgrade to PostgreSQL for production
4. **Image Storage**: Images stored as URLs; recommend S3/cloud storage
5. **Offline Support**: No service workers; all features require internet
6. **Rate Limiting**: API routes lack rate limiting; recommend adding
7. **Input Validation**: Should use Zod/Joi for schema validation
8. **Error Handling**: Inconsistent error responses; standardize format

---

## 🚀 Getting Started for Developers

1. **Install Dependencies**: `npm install`
2. **Setup Database**: `npx prisma generate && npx prisma db push`
3. **Environment Variables**: Create `.env.local` with `JWT_SECRET`, `DATABASE_URL`
4. **Run Dev Server**: `npm run dev`
5. **Access App**: `http://localhost:3000`

---

**Last Updated**: February 27, 2026
**Version**: 1.0 (Post Demo-Removal Refactor)
