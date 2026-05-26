# 📱 Mini LMS — React Native Expo

A production-grade Learning Management System mobile app built with React Native Expo, demonstrating native features, WebView integration, and robust state management.

---

## Problem Statement

Learners need a seamless mobile experience to browse courses, track progress, and consume content — even offline. This app bridges native mobile capabilities with web-based course content via WebView, all backed by secure, persistent state.

---

## Features

- 🔐 JWT Authentication with SecureStore persistence & auto-login
- 📚 Course catalog with search, filter, and bookmarking
- 🌐 WebView-based course content viewer with native ↔ web communication
- 🔔 Local notifications (bookmark milestones + re-engagement reminders)
- 📶 Offline mode detection with graceful degradation
- 🔁 API retry logic with timeout handling
- 👤 User profile with statistics and avatar update

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native Expo (latest stable SDK) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS) |
| Sensitive Storage | Expo SecureStore |
| App Storage | AsyncStorage / MMKV |
| HTTP Client | Axios with interceptors |
| List Rendering | LegendList |
| WebView | react-native-webview |
| Notifications | expo-notifications |

---

## Project Structure

```
app/
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    index.tsx          # Course catalog
    bookmarks.tsx
    profile.tsx
  course/
    [id].tsx           # Course detail
    webview.tsx        # Content viewer
components/
  ui/                  # Reusable UI primitives
  course/              # Course-specific components
  shared/              # Layout, error boundary, offline banner
hooks/                 # Custom hooks
lib/
  api/                 # Axios instance + interceptors
  store/               # Global state
  notifications/       # Notification helpers
  storage/             # SecureStore + AsyncStorage wrappers
types/                 # TypeScript interfaces
docs/                  # Project documentation
```

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
git clone <repo-url>
cd mini-lms
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.freeapi.app
EXPO_PUBLIC_APP_ENV=development
```

> ⚠️ Never commit `.env` to version control.

### Run the App

```bash
# Start development server
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android --profile preview
```

---

## API Reference

Base URL: `https://api.freeapi.app`

| Purpose | Endpoint |
|---|---|
| Register | `POST /api/v1/users/register` |
| Login | `POST /api/v1/users/login` |
| User Profile | `GET /api/v1/users/current-user` |
| Course Instructors | `GET /api/v1/public/randomusers` |
| Courses (Products) | `GET /api/v1/public/randomproducts` |

---

## Key Architectural Decisions

See [`docs/DECISIONS.md`](./docs/DECISIONS.md) for full rationale.

- **Expo Router** over React Navigation — file-based routing reduces boilerplate
- **SecureStore** for tokens — hardware-backed encryption on both platforms
- **Axios interceptors** — centralized token injection and 401 refresh handling
- **LegendList** over FlatList — better performance for large course catalogs

---

## Known Issues / Limitations

- Token refresh is basic; full rotation not implemented
- WebView loads a local HTML template, not a real CMS
- Landscape mode supported but optimized primarily for portrait
- Background task (24hr notification) requires physical device; may not fire in simulator

---

## Screenshots

> Add screenshots here after first build.

| Login | Course Catalog | Course Detail | WebView |
|---|---|---|---|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

---

## Demo Video

> Link to 3–5 minute walkthrough — _TBD after build_

---

## Author

Built as a technical assignment demonstrating senior-level React Native Expo engineering.
