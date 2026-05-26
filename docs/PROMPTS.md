# PROMPTS.md

> Reusable, high-quality prompts for AI-assisted coding on this project.
> Copy-paste these at session start or when tackling each feature.

---

## 🧠 Master Context Prompt (Use at Every Session Start)

```
I'm building a Mini LMS mobile app with React Native Expo.

Stack:
- Expo SDK (latest stable), TypeScript strict mode
- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS for React Native)
- Expo SecureStore (JWT token storage)
- AsyncStorage (bookmarks, enrolled courses, preferences)
- Axios with request/response interceptors
- LegendList for course catalog
- react-native-webview for content
- expo-notifications for local push

Rules:
- Functional components + hooks only, no class components
- No `any` types — strict TypeScript throughout
- No deprecated Expo APIs
- No console.log in final code
- All async errors must be caught and handled

API Base: https://api.freeapi.app
- Auth: POST /api/v1/users/login, /api/v1/users/register
- Profile: GET /api/v1/users/current-user
- Instructors: GET /api/v1/public/randomusers
- Courses: GET /api/v1/public/randomproducts
```

---

## 🔐 Auth System Prompt

```
Generate a complete authentication system for my React Native Expo app.

Requirements:
1. AuthContext with: user, token, login(), logout(), isLoading, isAuthenticated
2. login() calls POST /api/v1/users/login, stores JWT in SecureStore
3. On app start, read token from SecureStore, validate by calling /api/v1/users/current-user
4. If token valid → navigate to (tabs), if invalid → clear token → navigate to (auth)
5. logout() clears SecureStore + AsyncStorage + resets context state
6. Axios interceptor reads token from SecureStore and injects as Bearer header

Use TypeScript strict mode. Use expo-secure-store and @react-native-async-storage/async-storage.
Show the full AuthContext, the Axios client setup, and the root _layout.tsx handling auto-login.
```

---

## 📚 Course Catalog Prompt

```
Build a course catalog screen for my React Native Expo LMS app.

Data sources:
- Instructors: GET https://api.freeapi.app/api/v1/public/randomusers
- Courses (products): GET https://api.freeapi.app/api/v1/public/randomproducts
- Merge them: assign each course a random instructor

Requirements:
1. CourseCard component: thumbnail (Expo Image), title, instructor name, description snippet, bookmark icon
2. Use LegendList (@legendapp/list) for the list
3. React.memo on CourseCard
4. keyExtractor using course id
5. Pull-to-refresh
6. Search bar with 300ms debounce — filters by title or description
7. Bookmarks stored in AsyncStorage, toggle on card tap
8. Trigger expo-notification when 5th course is bookmarked

Use NativeWind for all styling. TypeScript strict mode.
```

---

## 🌐 WebView Integration Prompt

```
Build a WebView screen for my React Native Expo LMS app that displays course content.

Requirements:
1. Receive course data via Expo Router params (id, title, description, instructor)
2. Create a local HTML template string that renders the course info with clean styling
3. Use react-native-webview's injectedJavaScript to pass course data into the WebView
4. The WebView HTML should listen for window.ReactNativeWebView.postMessage and respond back
5. Handle WebView load errors: show a retry button on failure
6. Show ActivityIndicator while WebView loads
7. Back button in header to return to course detail

Show the full webview screen component + the HTML template. TypeScript strict mode. NativeWind where applicable.
```

---

## 🔔 Notifications Prompt

```
Implement local notifications for my React Native Expo LMS app using expo-notifications.

Two notification scenarios:
1. BOOKMARK MILESTONE: When user bookmarks their 5th course, immediately show a notification:
   Title: "You're on fire! 🔥"
   Body: "You've bookmarked 5 courses. Time to start learning!"

2. RE-ENGAGEMENT REMINDER: Schedule a notification 24 hours after the user's last app open.
   Cancel and reschedule every time the app comes to foreground.
   Title: "Don't lose your streak 📚"
   Body: "You haven't visited your courses today. Keep up the momentum!"

Include:
- Permission request on app launch
- Graceful handling if permissions denied (don't crash)
- Full hook: useNotifications() that sets this all up

TypeScript strict mode. Expo SDK only.
```

---

## 🔁 API Retry & Error Handling Prompt

```
Build a robust Axios setup for my React Native Expo app with:

1. Base URL from EXPO_PUBLIC_API_BASE_URL env variable
2. 10 second timeout on all requests
3. Request interceptor: read JWT from SecureStore, attach as Authorization: Bearer header
4. Response interceptor:
   - On 401: attempt token refresh (basic — just clear token and redirect to login for now)
   - On network error: throw a typed NetworkError
   - On timeout: throw a typed TimeoutError
5. Retry wrapper: retries failed requests up to 3 times with exponential backoff (1s, 2s, 4s)
   - Only retry on 5xx or network errors, not 4xx
6. Offline detection hook: useNetworkStatus() using @react-native-community/netinfo
7. OfflineBanner component: shows a NativeWind-styled banner at top when offline

TypeScript strict mode. All errors should be typed, not generic Error.
```

---

## 👤 Profile Screen Prompt

```
Build a profile screen for my React Native Expo LMS app.

Requirements:
1. Fetch user data from GET /api/v1/users/current-user
2. Display: avatar, full name, email, username
3. Show stats: number of bookmarked courses (from AsyncStorage), number of enrolled courses (from AsyncStorage)
4. Profile picture update: tap avatar → Expo ImagePicker → update displayed image → store URI in AsyncStorage
5. Logout button: calls AuthContext.logout(), clears all storage, redirects to login
6. Loading skeleton while fetching user data

Use NativeWind for all styling. TypeScript strict mode.
```

---

## 🐛 Debug / Code Review Prompt

```
Review this React Native Expo TypeScript component for:

1. TypeScript issues (missing types, unsafe casts, any usage)
2. Performance issues (unnecessary re-renders, missing memo/useCallback/useMemo)
3. Memory leaks (uncleaned subscriptions, missing cleanup in useEffect)
4. Expo-specific issues (deprecated APIs, platform incompatibilities)
5. NativeWind styling issues
6. Error handling gaps (unhandled promise rejections, missing try/catch)

Be specific. Point to exact lines. Suggest fixes with code.

[PASTE COMPONENT HERE]
```

---

## 📁 Folder Scaffolding Prompt

```
Generate the initial folder and file structure for my React Native Expo LMS app.

Create these files with proper TypeScript boilerplate (no implementation, just typed shells):

app/
  _layout.tsx — root layout with AuthContext provider
  (auth)/_layout.tsx — auth stack
  (auth)/login.tsx
  (auth)/register.tsx
  (tabs)/_layout.tsx — bottom tab layout
  (tabs)/index.tsx — course catalog
  (tabs)/bookmarks.tsx
  (tabs)/profile.tsx
  course/[id].tsx
  course/webview.tsx

lib/
  api/client.ts — Axios instance
  api/auth.ts — auth API calls
  api/courses.ts — course API calls
  storage/secure.ts — SecureStore helpers
  storage/async.ts — AsyncStorage helpers
  notifications/index.ts — notification helpers

contexts/
  AuthContext.tsx
  CourseContext.tsx

types/
  auth.ts
  course.ts
  api.ts

Show each file with proper imports, TypeScript interfaces, and function signatures only.
```
