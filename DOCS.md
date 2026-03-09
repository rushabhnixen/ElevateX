# ElevateX — Complete Project Documentation

> **Version:** 1.0.0  
> **Last Updated:** March 2026  
> **Repository:** [github.com/rushabhnixen/ElevateX](https://github.com/rushabhnixen/ElevateX)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Directory Structure](#4-directory-structure)
5. [Data Models](#5-data-models)
6. [API Reference](#6-api-reference)
7. [Frontend Pages & Components](#7-frontend-pages--components)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Real-Time Features](#9-real-time-features)
10. [Admin Panel](#10-admin-panel)
11. [Responsive Design](#11-responsive-design)
12. [Environment Variables](#12-environment-variables)
13. [Seed Data](#13-seed-data)
14. [Running Locally](#14-running-locally)
15. [Deployment](#15-deployment)
16. [Test Accounts](#16-test-accounts)
17. [Feature Roadmap](#17-feature-roadmap)

---

## 1. Project Overview

**ElevateX** is a TikTok-style startup pitch platform that connects **founders** with **investors** through short video pitches. Founders record and upload 60-second video pitches for their startups. Investors swipe through a vertical video feed, like/bookmark pitches, leave comments, and send connection requests. An **admin** moderates all content before it goes live.

### Core User Flows

| Role | Flow |
|------|------|
| **Founder** | Register → Select "Founder" role → Upload pitch video → Wait for admin approval → Receive investor connections → Chat with interested investors |
| **Investor** | Register → Select "Investor" role → Browse feed / explore → Like & bookmark → Send connection request → Chat with founders |
| **Admin** | Login with admin credentials → Review pending pitches → Approve or reject with reason → Manage users |

### Key Features

- **Vertical video feed** — TikTok-style swipe-based feed of approved startup pitches
- **Explore page** — Grid-based discovery with search, industry, and stage filters
- **Startup detail page** — Full pitch view with video player, metrics, team info, comments
- **Real-time messaging** — Socket.IO powered chat between matched founders & investors
- **Connection system** — Investors send connection requests to founders; founders accept/decline
- **Notification system** — In-app notifications for likes, comments, matches, approvals
- **Admin moderation** — All pitches go through admin review before going live
- **Profile management** — Edit bio, headline, company, social links, investment thesis
- **Responsive design** — Desktop sidebar + mobile bottom nav, fluid layouts at every breakpoint

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client (React SPA)                    │
│  Vite dev server :5173 ──proxy──▶ Express API :3001       │
│                                                           │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐ │
│  │  Pages   │  │Components│  │  Context    │  │  Hooks  │ │
│  │ Feed     │  │ VideoCard│  │ AuthContext │  │ useSwipe│ │
│  │ Explore  │  │ BottomNav│  │ SocketCtx  │  │ useSocket│ │
│  │ Inbox    │  │ ChatView │  │            │  │         │ │
│  │ Profile  │  │ StartupCd│  │            │  │         │ │
│  │ Admin    │  │ Filter   │  │            │  │         │ │
│  │ Upload   │  │ Search   │  │            │  │         │ │
│  └─────────┘  └──────────┘  └────────────┘  └─────────┘ │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP + WebSocket
┌───────────────────────▼──────────────────────────────────┐
│                   Server (Express + Socket.IO)            │
│                                                           │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Routes   │  │ Controllers│  │    Middleware         │  │
│  │ /auth     │  │ startup    │  │ requireAuth (JWT)    │  │
│  │ /startups │  │ match      │  │ requireAdmin         │  │
│  │ /users    │  │            │  │ optionalAuth         │  │
│  │ /messages │  │            │  │ rate limiting         │  │
│  │ /matches  │  │            │  │                      │  │
│  │ /admin    │  │            │  │                      │  │
│  │ /notifs   │  │            │  │                      │  │
│  └──────────┘  └────────────┘  └──────────────────────┘  │
│                        │                                  │
│              ┌─────────▼──────────┐                       │
│              │  MongoDB (Mongoose) │                       │
│              │  7 collections      │                       │
│              └────────────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

### Request Flow

1. Frontend makes API call via `axios` (configured in `src/lib/api.js`)
2. Vite dev server proxies `/api/*` and `/socket.io/*` to Express at port 3001
3. Express middleware chain: CORS → JSON parser → Route matching → Auth middleware → Controller
4. Controller interacts with Mongoose models → MongoDB
5. Response returns JSON to the frontend

### Real-Time Flow

1. Client connects to Socket.IO on mount (via `SocketContext`)
2. User joins personal notification room (`user:{userId}`)
3. On chat open, user joins match room (`match_{id1}_{id2}`)
4. Messages are emitted via socket AND persisted via REST API
5. Typing indicators broadcast to room (excluding sender)

---

## 3. Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.1 | Build tool & dev server |
| React Router | 6.22 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.0 | Animations & transitions |
| Axios | 1.6 | HTTP client |
| Lucide React | 0.356 | Icon library |
| React Player | 2.15 | Video playback |
| Socket.IO Client | 4.7 | WebSocket client |
| clsx + tailwind-merge | — | Conditional class merging |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 4.18 | HTTP server framework |
| Mongoose | 8.2 | MongoDB ODM |
| Socket.IO | 4.7 | WebSocket server |
| jsonwebtoken | 9.0 | JWT authentication |
| bcryptjs | 3.0 | Password hashing |
| Cloudinary | 2.0 | Video/image hosting (production) |
| Multer | 2.1 | File upload handling |
| express-rate-limit | 8.3 | API rate limiting |
| mongodb-memory-server | 11.0 | In-memory DB for development |
| dotenv | 16.4 | Environment variable loading |

### Design System

| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `#6366f1` (Indigo) | Primary action color, buttons, links |
| `accent-hover` | `#4f46e5` | Hover state for accent |
| `surface` | `#1a1a1a` | Card/panel backgrounds |
| `background` | `#0f0f0f` | Page background |
| `muted` | `#71717a` | Secondary text |
| `border` | `#27272a` | Borders and dividers |

---

## 4. Directory Structure

```
ElevateX/
├── index.html                    # Entry HTML (Vite)
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite config + API proxy
├── tailwind.config.js            # Tailwind custom tokens
├── postcss.config.js             # PostCSS (Tailwind)
├── DOCS.md                       # This documentation
├── DEPLOYMENT.md                 # Deployment guide
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # App icons (192x192, 512x512)
├── server/
│   ├── index.js                  # Express + Socket.IO + MongoDB setup + seed data
│   ├── package.json              # Server dependencies
│   ├── controllers/
│   │   ├── startupController.js  # CRUD, like, bookmark, comments, admin review
│   │   └── matchController.js    # Create/list/update connection requests
│   ├── middleware/
│   │   ├── auth.js               # JWT requireAuth + signToken
│   │   └── admin.js              # requireAdmin middleware
│   ├── models/
│   │   ├── User.js               # User schema (founder/investor/admin)
│   │   ├── Startup.js            # Startup pitch schema
│   │   ├── Match.js              # Connection request schema
│   │   ├── Message.js            # Chat message schema
│   │   ├── Comment.js            # Comment schema
│   │   ├── Notification.js       # Notification schema
│   │   └── Pitch.js              # Legacy pitch schema (unused)
│   └── routes/
│       ├── auth.js               # Register, login, me
│       ├── startups.js           # CRUD + engage endpoints
│       ├── users.js              # Profile, follow, bookmarks
│       ├── messages.js           # Chat message history + send
│       ├── matches.js            # Connection request management
│       ├── admin.js              # Admin stats, review, user management
│       └── notifications.js      # List, read, mark-all-read
└── src/
    ├── App.jsx                   # Root component + routing
    ├── main.jsx                  # ReactDOM entry point
    ├── index.css                 # Tailwind imports + custom utilities
    ├── components/
    │   ├── layout/
    │   │   ├── MainLayout.jsx    # App shell: sidebar (desktop) + bottom nav (mobile) + <Outlet>
    │   │   └── BottomNav.jsx     # Mobile bottom navigation with notification badge
    │   ├── feed/
    │   │   ├── VideoCard.jsx     # Full-screen video pitch card (feed item)
    │   │   └── CommentsSheet.jsx # Bottom sheet for comments on a pitch
    │   ├── explore/
    │   │   ├── StartupCard.jsx   # Grid card for explore page
    │   │   ├── SearchBar.jsx     # Search input with icon
    │   │   └── FilterChips.jsx   # Horizontal scrollable filter pills
    │   ├── inbox/
    │   │   ├── ChatView.jsx      # Full chat interface with real-time messaging
    │   │   ├── ConversationItem.jsx  # Conversation list item
    │   │   └── NotificationItem.jsx  # Notification list item
    │   └── ui/
    │       ├── Avatar.jsx        # Avatar with initials fallback
    │       ├── Badge.jsx         # Colored badge (industry/stage)
    │       ├── BottomSheet.jsx   # Draggable bottom sheet
    │       ├── Button.jsx        # Primary button component
    │       ├── Input.jsx         # Labeled text input
    │       └── Modal.jsx         # Modal overlay
    ├── context/
    │   ├── AuthContext.jsx       # Auth state: user, role, login, register, logout
    │   └── SocketContext.jsx     # Socket.IO connection management
    ├── hooks/
    │   ├── useIntersection.js    # Intersection Observer hook
    │   ├── usePushNotifications.js  # Browser notification permissions
    │   ├── useSocket.js          # Legacy socket hook
    │   └── useSwipeFeed.js       # Touch swipe handling for feed
    ├── lib/
    │   ├── api.js                # Axios instance + all API modules
    │   ├── utils.js              # cn(), formatTime(), formatNumber()
    │   └── mockData.js           # Sample data (legacy, for reference)
    └── pages/
        ├── AuthPage.jsx          # Login / Register with tab toggle
        ├── Onboarding.jsx        # 4-slide intro carousel
        ├── RoleSelect.jsx        # Investor vs Founder role selection
        ├── FeedPage.jsx          # TikTok-style vertical video feed
        ├── ExplorePage.jsx       # Grid-based startup discovery
        ├── UploadPage.jsx        # Pitch upload form (founders only)
        ├── InboxPage.jsx         # Messages, requests, notifications tabs
        ├── ProfilePage.jsx       # User profile, pitches/bookmarks, edit modal
        ├── StartupDetailPage.jsx # Full startup detail with video + connect CTA
        └── AdminPage.jsx         # Admin dashboard for content moderation
```

---

## 5. Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `name` | String (required) | Display name |
| `email` | String (unique, required) | Login email, stored lowercase |
| `passwordHash` | String (required) | bcrypt hash (12 rounds) |
| `avatar` | String | Avatar URL |
| `role` | Enum: `founder`, `investor`, `admin` | User type (default: `investor`) |
| `bio` | String (max 500) | User biography |
| `headline` | String | Title/position |
| `company` | String | Company or fund name |
| `location` | String | City, Country |
| `website` | String | Personal/company website |
| `linkedin` | String | LinkedIn URL |
| `twitter` | String | Twitter/X handle |
| `investmentThesis` | String | What they invest in (investors) |
| `preferredStages` | [String] | Preferred funding stages |
| `preferredIndustries` | [String] | Preferred industries |
| `verified` | Boolean | Admin-verified account |
| `following` | [ObjectId → User] | Users being followed |
| `followers` | [ObjectId → User] | Users following this user |
| `bookmarks` | [ObjectId → Startup] | Bookmarked startups |
| `onboardingComplete` | Boolean | Completed onboarding flow |

**Indexes:** `role`, text index on `name + company + bio`  
**Transform:** `passwordHash` is stripped from JSON output automatically.

### Startup

| Field | Type | Description |
|-------|------|-------------|
| `name` | String (required) | Startup name |
| `tagline` | String (required) | One-line description |
| `description` | String | Full description |
| `industry` | Enum | FinTech, CleanTech, EdTech, HealthTech, SaaS, DeepTech, AI/ML, Web3, BioTech, Other |
| `stage` | Enum | Pre-seed, Seed, Series A, Series B+ |
| `askAmount` | String | Fundraise amount (e.g., "2M") |
| `equity` | String | Equity offered (e.g., "10%") |
| `traction` | String | Traction metric (e.g., "15K users") |
| `videoUrl` | String | Pitch video URL |
| `videoPublicId` | String | Cloudinary public ID for deletion |
| `thumbnail` | String | Auto-generated thumbnail URL |
| `pitchDeckUrl` | String | PDF pitch deck URL |
| `website` | String | Startup website |
| `metrics` | Object | `{ revenue, users, growth }` |
| `status` | Enum | `draft`, `pending`, `approved`, `rejected` (default: `pending`) |
| `rejectionReason` | String | Admin rejection reason |
| `reviewedBy` | ObjectId → User | Admin who reviewed |
| `reviewedAt` | Date | Review timestamp |
| `likes` | Number | Total like count |
| `comments` | Number | Total comment count |
| `bookmarks` | Number | Total bookmark count |
| `views` | Number | Total view count |
| `likedBy` | [ObjectId → User] | Users who liked |
| `bookmarkedBy` | [ObjectId → User] | Users who bookmarked |
| `viewedBy` | [ObjectId → User] | Users who viewed |
| `founder` | Object | `{ userId, name, title, bio, avatar }` |
| `team` | [Object] | `[{ name, role, avatar }]` |

**Indexes:** `status + createdAt`, `founder.userId`, `industry + stage`, text index on `name + tagline + description`

### Match (Connection Request)

| Field | Type | Description |
|-------|------|-------------|
| `founder` | ObjectId → User | Founder receiving the request |
| `investor` | ObjectId → User | Investor sending the request |
| `startup` | ObjectId → Startup | Startup the request is about |
| `status` | Enum | `pending`, `matched`, `rejected`, `withdrawn` |
| `initiatedBy` | ObjectId → User | Who sent the request |
| `message` | String | Optional intro message |
| `roomId` | String | Socket.IO room ID for chat |

**Index:** Unique compound on `founder + investor`

### Message

| Field | Type | Description |
|-------|------|-------------|
| `roomId` | String (required) | Chat room identifier |
| `sender` | ObjectId → User | Message author |
| `text` | String (required) | Message content |
| `read` | Boolean | Read receipt |

**Index:** `roomId + createdAt`

### Comment

| Field | Type | Description |
|-------|------|-------------|
| `startup` | ObjectId → Startup | Parent startup |
| `user` | ObjectId → User | Comment author |
| `text` | String (max 1000) | Comment content |
| `likes` | Number | Like count |
| `likedBy` | [ObjectId → User] | Users who liked |

**Index:** `startup + createdAt`

### Notification

| Field | Type | Description |
|-------|------|-------------|
| `recipient` | ObjectId → User | Who receives it |
| `type` | Enum | `like`, `comment`, `match_request`, `match_accepted`, `match_rejected`, `startup_approved`, `startup_rejected`, `follow`, `message` |
| `from` | ObjectId → User | Who triggered it |
| `startup` | ObjectId → Startup | Related startup |
| `match` | ObjectId → Match | Related match |
| `message` | String | Display text |
| `read` | Boolean | Read status |

**Index:** `recipient + read + createdAt`

---

## 6. API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | No | `{ name, email, password, role }` | `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | Yes | — | `User` object |

### Startups (`/api/startups`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/startups` | Optional | List startups. Query: `status`, `industry`, `stage`, `search`, `founder`, `limit`, `skip` |
| GET | `/api/startups/:id` | Optional | Get single startup (increments views) |
| POST | `/api/startups` | Yes | Create new startup. Accepts `multipart/form-data` with `video` file |
| PUT | `/api/startups/:id` | Yes | Update startup (owner only). Content changes re-submit for review |
| DELETE | `/api/startups/:id` | Yes | Delete startup (owner only). Removes Cloudinary video |
| POST | `/api/startups/:id/like` | Yes | Toggle like (deduplicated). Sends notification to founder |
| POST | `/api/startups/:id/bookmark` | Yes | Toggle bookmark (deduplicated) |
| GET | `/api/startups/:id/comments` | No | List comments (newest first, limit 50) |
| POST | `/api/startups/:id/comments` | Yes | Add comment. Sends notification to founder |

**Rate Limits:** Read endpoints: 100/min. Write endpoints: 20/min.

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:id` | No | Public profile + startup count |
| PUT | `/api/users/:id` | Yes | Update own profile (whitelisted fields only) |
| POST | `/api/users/:id/follow` | Yes | Toggle follow/unfollow. Sends notification |
| GET | `/api/users/:id/bookmarks` | Yes | Get user's bookmarked startups (self only) |
| POST | `/api/users/:id/bookmark/:startupId` | Yes | Toggle startup bookmark on user (self only) |

### Messages (`/api/messages`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages/:roomId` | Yes | Get message history. Query: `limit`, `before` |
| POST | `/api/messages` | Yes | Send message. Body: `{ roomId, text }` |

### Matches (`/api/matches`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matches` | Yes | List user's matches. Query: `status` |
| POST | `/api/matches` | Yes | Create connection request. Body: `{ founderId, startupId, message }` |
| PUT | `/api/matches/:id` | Yes | Update status: `matched`, `rejected`, `withdrawn` |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats (users, startups, pending, matches) |
| GET | `/api/admin/startups` | Admin | List startups by status. Query: `status`, `limit`, `skip` |
| PUT | `/api/admin/startups/:id/review` | Admin | Approve/reject. Body: `{ status, rejectionReason }` |
| GET | `/api/admin/users` | Admin | List all users. Query: `role`, `limit`, `skip` |
| PUT | `/api/admin/users/:id` | Admin | Update user (verify, change role) |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Yes | List notifications (limit 50) + unread count |
| PUT | `/api/notifications/read-all` | Yes | Mark all as read |
| PUT | `/api/notifications/:id/read` | Yes | Mark single as read |

---

## 7. Frontend Pages & Components

### Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| `Onboarding` | (shown once) | Public | 4-slide intro carousel. Sets `elevate_onboarded` in localStorage |
| `AuthPage` | (shown when !user) | Public | Sign In / Sign Up with tab toggle, role selection on register |
| `RoleSelect` | (shown when !role) | Auth | Choose Investor or Founder role |
| `ExplorePage` | `/` (default) | Auth | Grid-based startup discovery with search & filters |
| `FeedPage` | `/feed` | Auth | TikTok-style vertical swipe video feed |
| `UploadPage` | `/upload` | Founder | Pitch upload form with video, team, financials |
| `InboxPage` | `/inbox` | Auth | 3 tabs: messages, connection requests, notifications |
| `ProfilePage` | `/profile` | Auth | User profile with pitches/bookmarks, edit modal, analytics |
| `StartupDetailPage` | `/startup/:id` | Auth | Full startup view with video, metrics, connect CTA |
| `AdminPage` | `/admin` | Admin | Dashboard, pitch review, user management |

### Key Components

| Component | Purpose |
|-----------|---------|
| `MainLayout` | App shell with responsive sidebar (desktop) + BottomNav (mobile) |
| `BottomNav` | Mobile-only bottom tab bar with role-aware tabs + notification badge |
| `VideoCard` | Full-screen video in feed with like/bookmark/share/comment actions |
| `CommentsSheet` | Animated bottom sheet for viewing/adding comments |
| `StartupCard` | Compact card for explore grid with gradient header |
| `ChatView` | Full chat interface with real-time Socket.IO integration |
| `SearchBar` | Search input with magnifying glass icon |
| `FilterChips` | Horizontal scrollable industry/stage filter pills |

---

## 8. Authentication & Authorization

### JWT Flow

1. User registers or logs in → server returns JWT token
2. Token stored in `localStorage` as `elevatex_token`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. `requireAuth` middleware verifies token, sets `req.userId`
5. On 401 response, interceptor clears token → user redirected to login

### Token Details

- **Algorithm:** HS256
- **Expiry:** 30 days
- **Secret:** `JWT_SECRET` env var (defaults to `elevatex-dev-secret-change-in-production`)
- **Payload:** `{ sub: userId }`

### Role-Based Access

| Role | Access |
|------|--------|
| `investor` | Feed, Explore, Inbox, Profile, Startup Detail, Connection requests |
| `founder` | Same as investor + Upload Pitch page, receive connection requests |
| `admin` | Admin panel only (automatic redirect). Full content moderation |

---

## 9. Real-Time Features

### Socket.IO Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `roomId` | Join a chat room |
| `join_user_room` | Client → Server | `userId` | Join personal notification channel |
| `send_message` | Client → Server | `{ roomId, text, senderId, senderName }` | Send chat message |
| `receive_message` | Server → Client | `{ roomId, text, senderId, senderName, timestamp }` | Receive chat message |
| `typing` | Bidirectional | `{ roomId, userId, isTyping }` | Typing indicator |
| `notification` | Server → Client | Notification object | Real-time notification |
| `user_joined` | Server → Client | `{ socketId }` | User joined room |

### Connection Setup

```javascript
// Client connects with auth token
const socket = io(SOCKET_URL, {
  auth: { token },
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
});
```

---

## 10. Admin Panel

### Login

- **Email:** `admin@elevatex.com`
- **Password:** `admin123`
- Admin account is auto-seeded on first server start

### Features

1. **Dashboard Stats** — Total users, total startups, pending pitches, total matches, founders count, investors count
2. **Pitch Review** — View pending pitches with details, approve with one click, reject with optional reason
3. **Video Preview** — Watch pitch videos inline before making review decisions
4. **Startup Management** — Browse approved, rejected, pending pitches. View all details
5. **User Management** — View all users, filter by role, verify users, change roles
6. **Responsive Layout** — Full desktop layout with sidebar, mobile-friendly card layout

### Review Workflow

```
Founder uploads pitch → status: "pending"
  ↓
Admin views in "Pending" tab → clicks "Approve" or "Reject"
  ↓
If approved → status: "approved" → Founder notified → Pitch visible in feed/explore
If rejected → status: "rejected" + reason → Founder notified with reason
  ↓
Founder edits content → status reverts to "pending" → Re-enters review queue
```

---

## 11. Responsive Design

### Breakpoint Strategy

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Bottom nav, single column, full-width cards |
| Tablet | 768px-1024px | Sidebar nav, 2-column grid |
| Desktop | > 1024px | Sidebar nav, 3-4 column grid, wider content |

### Layout Behavior

- **Mobile:** BottomNav visible at bottom, sidebar hidden. Content fills viewport width
- **Desktop:** Sidebar appears on left (w-64), BottomNav hidden. Content area has max-width constraint
- **Admin:** Always uses full viewport (no max-width restriction)
- **Video feed:** Full-viewport height on both mobile and desktop

---

## 12. Environment Variables

### Server (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `MONGODB_URI` | — | MongoDB connection string (falls back to in-memory) |
| `JWT_SECRET` | `elevatex-dev-secret-change-in-production` | JWT signing secret |
| `CLIENT_URL` | `http://localhost:5173` | CORS origin |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |

### Client (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | API base URL |
| `VITE_SOCKET_URL` | `http://localhost:3001` | Socket.IO server URL |

---

## 13. Seed Data

On first server start (when database is empty), the following data is automatically created:

### Admin User
- **Email:** admin@elevatex.com
- **Password:** admin123
- **Role:** admin

### Demo Founder
- **Email:** demo@elevatex.com
- **Password:** demo123
- **Name:** Alex Rivera
- **Role:** founder

### 8 Demo Startups (all approved)

| Name | Industry | Stage | Ask |
|------|----------|-------|-----|
| NeuralPay | FinTech | Seed | $2M |
| GreenGrid | CleanTech | Pre-seed | $500K |
| EduSpark | EdTech | Series A | $5M |
| MedScan AI | HealthTech | Seed | $3M |
| CloudForge | SaaS | Seed | $1.5M |
| QuantumLeap | DeepTech | Series A | $8M |
| SynthMind | AI/ML | Pre-seed | $1M |
| ChainVault | Web3 | Seed | $4M |

---

## 14. Running Locally

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/rushabhnixen/ElevateX.git
cd ElevateX

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Start the backend (uses in-memory MongoDB)
cd server && node index.js &

# Start the frontend dev server
cd .. && npx vite --host
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001  

### Development Commands

```bash
# Frontend dev server
npm run dev

# Frontend production build
npm run build

# Preview production build
npm run preview

# Server with auto-reload
cd server && npm run dev
```

---

## 15. Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for a detailed free deployment guide using GitHub Student Pack benefits (MongoDB Atlas, Railway/Render, Cloudinary, Vercel).

---

## 16. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elevatex.com | admin123 |
| Demo Founder | demo@elevatex.com | demo123 |
| Register new | — | — |

---

## 17. Feature Roadmap

### Implemented ✅

- [x] JWT authentication (register/login/me)
- [x] Role-based access (founder/investor/admin)
- [x] Vertical video feed with swipe navigation
- [x] Explore page with search + industry/stage filters
- [x] Startup detail page with video, metrics, team
- [x] Like/bookmark toggle with dedup
- [x] Comment system with notifications
- [x] Connection request system (investor → founder)
- [x] Real-time chat (Socket.IO)
- [x] Typing indicators
- [x] In-app notifications
- [x] Admin review workflow (approve/reject)
- [x] Admin user management
- [x] Profile editing (bio, social links, etc.)
- [x] Founder analytics (views, likes, pitch status)
- [x] Video upload with Cloudinary integration
- [x] Responsive desktop + mobile layout
- [x] Onboarding carousel
- [x] PWA manifest

### Planned 🔮

- [ ] Email notifications (SendGrid/Resend)
- [ ] Social login (Google OAuth)
- [ ] Pitch deck upload (PDF viewer)
- [ ] Analytics dashboard for founders (charts)
- [ ] Investor portfolio tracking
- [ ] Advanced search with Elasticsearch
- [ ] Video transcription with AI
- [ ] Scheduled pitch releases
- [ ] Two-factor authentication
- [ ] Rate-limited video uploads per user
