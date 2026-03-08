# ElevateX

> **Instagram for Fundraising** — Connect startups with investors through 60-second video pitches.

ElevateX is a mobile-first Progressive Web App (PWA) that lets founders pitch their startup via short videos and connects them directly with investors. Think TikTok meets AngelList — swipe through pitches, like & save startups, chat with founders, and close deals, all from your phone.

---

## ✨ Features

- 📱 **Full-screen video feed** — Swipe up/down through startup pitches (TikTok style)
- ❤️ **Interactions** — Like, bookmark, share, and comment on pitches
- 🔍 **Explore** — Search & filter startups by industry, stage, and location
- 💬 **Real-time Inbox** — Direct messaging and connection requests
- 📤 **Upload** — 3-step wizard for founders to publish video pitches
- 👤 **Profiles** — Founder & investor profiles with metrics
- 🔔 **Push notifications** — Stay updated on new connections and messages
- 🌙 **Dark mode** — Beautiful dark-first design
- 📲 **Installable PWA** — Add to home screen on Android & iOS
- 🏪 **Play Store ready** — Publish via Trusted Web Activity (TWA)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Gestures | react-swipeable + embla-carousel-react |
| Video | react-player |
| Auth | Clerk (`@clerk/clerk-react`) |
| Real-time | Socket.io client |
| Icons | lucide-react |
| PWA | vite-plugin-pwa + Workbox |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Media Storage | Cloudinary |

---

## 📁 Folder Structure

```
elevatex/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons (192×192, 512×512)
├── src/
│   ├── main.jsx               # App entry point
│   ├── App.jsx                # Router + providers
│   ├── index.css              # Global styles + Tailwind
│   ├── pages/
│   │   ├── FeedPage.jsx       # Vertical video feed
│   │   ├── ExplorePage.jsx    # Search + filter startups
│   │   ├── UploadPage.jsx     # 3-step pitch upload wizard
│   │   ├── InboxPage.jsx      # Messages + connection requests
│   │   ├── ProfilePage.jsx    # User profile
│   │   ├── StartupDetailPage.jsx
│   │   ├── Onboarding.jsx     # First-launch intro slides
│   │   └── RoleSelect.jsx     # Founder / Investor selection
│   ├── components/
│   │   ├── layout/            # BottomNav, MainLayout
│   │   ├── feed/              # VideoCard, CommentsSheet
│   │   ├── explore/           # SearchBar, FilterChips, StartupCard
│   │   ├── inbox/             # ChatView, ConversationItem, NotificationItem
│   │   └── ui/                # Avatar, Badge, Button, Input, Modal
│   ├── hooks/
│   │   ├── useSwipeFeed.js    # Touch gesture feed navigation
│   │   ├── useIntersection.js # IntersectionObserver hook
│   │   ├── useSocket.js       # Socket.io hook
│   │   └── usePushNotifications.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   └── lib/
│       ├── mockData.js        # Mock startups, conversations, notifications
│       └── utils.js           # cn(), formatTime(), formatNumber()
├── server/
│   ├── index.js               # Express + Socket.io server
│   ├── routes/                # REST API routes
│   ├── models/                # Mongoose schemas
│   ├── middleware/            # Auth middleware
│   └── controllers/           # Route controllers
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend runs on `http://localhost:5173`

### Backend

```bash
cd server

# Install dependencies
npm install

# Start server (requires .env)
npm run dev
```

The API server runs on `http://localhost:3001`

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Frontend `.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend `server/.env`
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/elevatex
CLERK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

---

## 📲 PWA Install Guide

### Android (Chrome)
1. Open `https://your-domain.com` in Chrome
2. Tap the **"Add to Home Screen"** banner or go to **⋮ → Add to Home Screen**
3. Tap **Add** — the app icon will appear on your home screen
4. Launch ElevateX like a native app (no browser UI)

### iOS (Safari)
1. Open the URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add**

---

## 🏪 Publish to Google Play Store via TWA

ElevateX can be published to the Play Store as a **Trusted Web Activity (TWA)** using [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap).

### Step 1 — Install Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Step 2 — Initialize TWA Project
```bash
mkdir elevatex-twa && cd elevatex-twa
bubblewrap init --manifest https://your-domain.com/manifest.json
```

Bubblewrap will prompt you for:
- Application ID (e.g., `com.elevatex.app`)
- App name, icons, colors (auto-imported from manifest)
- Signing key details

### Step 3 — Build the APK/AAB
```bash
bubblewrap build
```

This generates `app-release-bundle.aab` (Android App Bundle).

### Step 4 — Verify Digital Asset Links
Add this file to your web server at `/.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.elevatex.app",
    "sha256_cert_fingerprints": ["YOUR_CERT_FINGERPRINT"]
  }
}]
```

Get your fingerprint:
```bash
bubblewrap fingerprint
```

### Step 5 — Upload to Play Console
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create a new app → Upload `app-release-bundle.aab`
3. Fill in store listing, screenshots, and content rating
4. Submit for review

---

## 🗺 Feature Roadmap

- [x] PWA setup (manifest, service worker, install prompt)
- [x] Vertical swipe video feed
- [x] Like, bookmark, share actions
- [x] Explore with search & filters
- [x] Inbox with chat UI
- [x] Upload wizard (3-step)
- [x] Founder & investor profiles
- [x] Onboarding slides
- [x] Role selection (Founder/Investor)
- [x] Bottom navigation
- [x] Dark mode design system
- [x] Express + Socket.io backend
- [x] Mongoose schemas
- [ ] Real Clerk authentication
- [ ] Live Socket.io messaging
- [ ] Cloudinary video upload
- [ ] Push notification service
- [ ] Investor matching algorithm
- [ ] Analytics dashboard
- [ ] Admin moderation panel
- [ ] Play Store launch

---

## 📄 License

MIT © ElevateX 2024
