# TASKS.md

> Your external brain. Move tasks between sections as you go.
> Never keep work-in-progress only in your head.

---

## 🔥 Active (Doing Right Now)

- [ ] _Fill in when you start a session_

---

## 📋 Sprint 1 — Project Setup & Auth

- [ ] Init Expo project with TypeScript template
- [ ] Enable TypeScript strict mode in `tsconfig.json`
- [ ] Install and configure NativeWind
- [ ] Set up Expo Router with `(auth)` and `(tabs)` groups
- [ ] Create folder structure (`components/`, `lib/`, `hooks/`, `types/`)
- [ ] Configure `.env` with `EXPO_PUBLIC_API_BASE_URL`
- [ ] Create Axios instance at `lib/api/client.ts`
- [ ] Add request interceptor (inject auth token)
- [ ] Add response interceptor (handle 401, retry logic)
- [ ] Add timeout config (10s default)
- [ ] Create SecureStore helpers (`lib/storage/secure.ts`)
- [ ] Create AsyncStorage helpers (`lib/storage/async.ts`)
- [ ] Build `AuthContext` with login/logout/auto-login
- [ ] Build Login screen (`app/(auth)/login.tsx`)
- [ ] Build Register screen (`app/(auth)/register.tsx`)
- [ ] Auto-login: check SecureStore token on app launch
- [ ] Redirect to catalog if token valid, auth screen if not
- [ ] Handle logout and clear all stored data

---

## 📋 Sprint 2 — Course Catalog

- [ ] Create TypeScript types: `Course`, `Instructor`, `User`
- [ ] Fetch instructors from `/api/v1/public/randomusers`
- [ ] Fetch courses from `/api/v1/public/randomproducts`
- [ ] Merge instructor data onto course items
- [ ] Build `CourseCard` component (thumbnail, title, instructor, bookmark icon)
- [ ] Build `CourseList` with LegendList
- [ ] Implement `keyExtractor` and `React.memo` on `CourseCard`
- [ ] Add pull-to-refresh (no UI jank)
- [ ] Build search bar with debounce (300ms)
- [ ] Filter courses by title/description locally
- [ ] Save bookmarks to AsyncStorage
- [ ] Bookmark toggle in `CourseCard` with visual feedback
- [ ] Show bookmarks tab with persisted list

---

## 📋 Sprint 3 — Course Detail & WebView

- [ ] Build Course Detail screen (`app/course/[id].tsx`)
- [ ] Show full course info (title, description, instructor, thumbnail)
- [ ] Add "Enroll" button with loading state + visual feedback
- [ ] Persist enrolled courses in AsyncStorage
- [ ] Build bookmark toggle on detail screen
- [ ] Build WebView screen (`app/course/webview.tsx`)
- [ ] Create local HTML template for course content display
- [ ] Pass course data from native → WebView via injected JS
- [ ] Handle WebView load errors with retry UI
- [ ] Add loading indicator while WebView loads

---

## 📋 Sprint 4 — Native Features

- [ ] Request notification permissions on app start
- [ ] Trigger notification when user bookmarks 5th course
- [ ] Schedule daily re-engagement notification (24hr reminder)
- [ ] Cancel re-engagement notification when user opens app
- [ ] Test notifications on physical device / simulator

---

## 📋 Sprint 5 — Error Handling & Offline Mode

- [ ] Create `ErrorBoundary` component
- [ ] Wrap root layout with `ErrorBoundary`
- [ ] Show user-friendly error UI (not raw error message)
- [ ] Add network status hook (`useNetworkStatus`)
- [ ] Show offline banner when no connection
- [ ] Queue failed requests or show retry button
- [ ] Implement API retry with exponential backoff (max 3 attempts)
- [ ] Add request timeout (10s) with friendly message

---

## 📋 Sprint 6 — Profile & Polish

- [ ] Build Profile screen (`app/(tabs)/profile.tsx`)
- [ ] Display user info from `/api/v1/users/current-user`
- [ ] Show stats: bookmarked courses, enrolled courses
- [ ] Profile picture update (Expo ImagePicker)
- [ ] Store profile picture URI in AsyncStorage
- [ ] Dark/light mode theming (if time permits)
- [ ] Accessibility: test with screen reader labels
- [ ] Landscape orientation check on all screens

---

## 📋 Sprint 7 — Docs, Build & Submission

- [ ] Clean up: remove all `console.log` and commented code
- [ ] Final README.md review
- [ ] Add screenshots to README
- [ ] Record 3–5 minute demo video
- [ ] EAS build — generate APK
- [ ] Upload APK to GitHub Releases
- [ ] Final repo check (clean commit history, no secrets committed)

---

## 🌟 Bonus (If Time Permits)

- [ ] React Hook Form + Zod validation on login/register
- [ ] Biometric auth (Face ID / fingerprint) via expo-local-authentication
- [ ] Jest unit tests for utility functions
- [ ] AI course recommendations via OpenAI SDK
- [ ] Sentry error tracking integration
- [ ] Certificate pinning for API calls
- [ ] CI/CD with GitHub Actions

---

## ✅ Completed

> Move tasks here when done (copy + check mark).

- [x] _Example: Scaffolded Expo project — 2024-XX-XX_

---

## 🗑️ Dropped / Won't Do

> Track anything consciously cut so you don't revisit it.

- _None yet_
