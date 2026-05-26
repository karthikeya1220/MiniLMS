# PROJECT_CONTEXT.md

> **Update this file at the END of every coding session.**
> Paste this into your AI tool at the START of every session.

---

## 🎯 Current Goal

Build a Mini LMS mobile app using React Native Expo as a developer assignment.
Demonstrate: native features, WebView, state management, auth, notifications, offline mode.

---

## 📦 Current Stack

- React Native + Expo SDK (latest stable)
- TypeScript strict mode
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- Expo SecureStore (token storage)
- AsyncStorage (app-level state)
- Axios (HTTP with interceptors)
- LegendList (performant lists)
- react-native-webview
- expo-notifications

---

## 🗂️ Folder Structure (Confirmed)

```
app/
  (auth)/login.tsx, register.tsx
  (tabs)/index.tsx, bookmarks.tsx, profile.tsx
  course/[id].tsx, webview.tsx
components/ui/, course/, shared/
hooks/
lib/api/, store/, notifications/, storage/
types/
docs/
```

---

## ✅ Current Progress

- [ ] Expo project scaffolded
- [ ] TypeScript strict mode configured
- [ ] NativeWind set up
- [ ] Expo Router configured
- [ ] Folder structure created
- [ ] Axios instance + interceptors
- [ ] SecureStore auth token helpers
- [ ] AsyncStorage course/bookmarks helpers
- [ ] Auth screens (login + register)
- [ ] Auto-login on app start
- [ ] Course catalog screen
- [ ] Pull-to-refresh
- [ ] Search/filter courses
- [ ] Course detail screen
- [ ] Bookmark toggle + local storage
- [ ] WebView content screen
- [ ] Native → WebView message passing
- [ ] Local notifications (bookmark milestone)
- [ ] Local notifications (24hr re-engagement)
- [ ] Offline mode banner
- [ ] Error boundaries
- [ ] API retry + timeout logic
- [ ] Profile screen
- [ ] Profile picture update
- [ ] User stats (enrolled, progress)

---

## 🔑 API Details

Base: `https://api.freeapi.app`

- Auth: `/api/v1/users/register`, `/api/v1/users/login`, `/api/v1/users/current-user`
- Instructors (as course instructors): `/api/v1/public/randomusers`
- Courses (as course data): `/api/v1/public/randomproducts`

**Auth flow:** JWT token → store in SecureStore → inject via Axios header → handle 401 refresh

---

## ⚠️ Constraints

- Must use Expo SDK only (no bare React Native)
- TypeScript strict mode — no `any` types
- Must work on iOS and Android
- Portrait + landscape orientation support
- No deprecated Expo APIs
- No debug logs or commented code in final submission

---

## 🧠 Active Decisions (Summary)

| Decision | Choice | Why |
|---|---|---|
| Storage for tokens | SecureStore | Hardware-backed, most secure |
| Storage for app data | AsyncStorage | Simple, well-supported in Expo |
| List component | LegendList | Better perf than FlatList for catalogs |
| HTTP client | Axios | Interceptors for auth + retry |
| Navigation | Expo Router | File-based, matches Next.js mental model |
| State management | React Context + hooks | No Redux overhead needed for this scope |

---

## 🚧 Current Blockers / Open Questions

- [ ] Confirm LegendList works well with NativeWind styled items
- [ ] Decide on local HTML template structure for WebView
- [ ] Test SecureStore on Android emulator (sometimes needs physical device)
- [ ] 24hr notification needs background task — check Expo TaskManager compatibility

---

## 📋 Next 3 Tasks (for this session)

1. 
2. 
3. 

> Fill these in at session start.

---

## 💡 Useful Context for AI Tools

When prompting AI for this project, always include:

> "This is a React Native Expo app using TypeScript strict mode, Expo Router, NativeWind, Axios with interceptors, and SecureStore for auth. Avoid class components, avoid any deprecated Expo APIs. Use functional components with hooks only."
