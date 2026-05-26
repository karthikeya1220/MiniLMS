# ARCHITECTURE.md

> System design reference. Keep this updated as the app grows.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Expo App                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth Layer  │  │ Course Layer │  │  Native Layer    │  │
│  │              │  │              │  │                  │  │
│  │ SecureStore  │  │ AsyncStorage │  │ Notifications    │  │
│  │ JWT Token    │  │ Bookmarks    │  │ ImagePicker      │  │
│  │ Auto-login   │  │ Enrolled     │  │ NetInfo          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                 │                                  │
│  ┌──────▼─────────────────▼───────────────────────────────┐ │
│  │                   Axios HTTP Client                    │ │
│  │         (interceptors: auth inject + 401 handle)       │ │
│  └──────────────────────────┬──────────────────────────── ┘ │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTPS
                    ┌─────────▼─────────┐
                    │  api.freeapi.app  │
                    │  /api/v1/users    │
                    │  /api/v1/public   │
                    └───────────────────┘
```

---

## Navigation Structure (Expo Router)

```
app/
├── _layout.tsx                 ← Root: AuthContext, ErrorBoundary, theme
├── (auth)/
│   ├── _layout.tsx             ← Stack navigator, no header
│   ├── login.tsx               ← Login form
│   └── register.tsx            ← Register form
├── (tabs)/
│   ├── _layout.tsx             ← Bottom tab bar (Catalog, Bookmarks, Profile)
│   ├── index.tsx               ← Course catalog (search + list)
│   ├── bookmarks.tsx           ← Saved bookmarks
│   └── profile.tsx             ← User profile + stats
└── course/
    ├── [id].tsx                ← Course detail screen
    └── webview.tsx             ← WebView content viewer
```

**Auth Guard:** Root `_layout.tsx` reads auth state from `AuthContext`.
- If `isAuthenticated` → render `(tabs)`
- If not → render `(auth)`
- While checking → render splash/loading screen

---

## Data Flow

### Authentication Flow

```
App Start
   │
   ▼
Read token from SecureStore
   │
   ├── Token exists → GET /api/v1/users/current-user
   │       │
   │       ├── 200 OK → Set user in AuthContext → Navigate to (tabs)
   │       └── 401/Error → Clear SecureStore → Navigate to (auth)
   │
   └── No token → Navigate to (auth)
                      │
                      ▼
              Login / Register
                      │
                      ▼
            POST /api/v1/users/login
                      │
                      ▼
          Store token in SecureStore
                      │
                      ▼
            Set user in AuthContext
                      │
                      ▼
              Navigate to (tabs)
```

### Course Catalog Flow

```
(tabs)/index.tsx mounts
   │
   ▼
CourseContext: fetch instructors + courses in parallel
   │
   ▼
Merge: courses[i].instructor = instructors[i % instructors.length]
   │
   ▼
Store in CourseContext state (not persisted — re-fetch on mount)
   │
   ▼
Load bookmarks from AsyncStorage → merge isBookmarked flag onto courses
   │
   ▼
Render with LegendList
   │
   ▼
Search input → debounce 300ms → filter courses in memory
```

### Bookmark Flow

```
User taps bookmark icon on CourseCard
   │
   ▼
Toggle isBookmarked in CourseContext state (optimistic UI)
   │
   ▼
Write updated bookmark list to AsyncStorage
   │
   ▼
Check bookmark count ≥ 5
   │
   └── Yes → scheduleLocalNotification("You're on fire!")
```

### WebView Communication

```
Native App (course/webview.tsx)
   │
   ▼
Prepare course data object: { title, description, instructor, thumbnail }
   │
   ▼
Inject via injectedJavaScript:
  window.postMessage(JSON.stringify(courseData), '*')
   │
   ▼
HTML Template receives message via window.addEventListener('message')
   │
   ▼
Renders course content with injected data
   │
   ▼
(Optional) WebView sends back events:
  window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ready' }))
   │
   ▼
Native onMessage handler receives and processes
```

---

## Storage Strategy

| Data | Storage | Why |
|---|---|---|
| JWT access token | SecureStore | Sensitive — hardware encryption |
| User profile (cache) | AsyncStorage | Non-sensitive, large |
| Bookmarked course IDs | AsyncStorage | Non-sensitive list |
| Enrolled course IDs | AsyncStorage | Non-sensitive list |
| User preferences | AsyncStorage | Non-sensitive settings |
| Profile picture URI | AsyncStorage | Just a file path |

**Key naming conventions:**
```
SecureStore:
  auth_token           ← JWT access token

AsyncStorage:
  @lms/user_profile    ← Cached user object
  @lms/bookmarks       ← string[] of course IDs
  @lms/enrolled        ← string[] of course IDs
  @lms/preferences     ← { theme, notifications }
  @lms/profile_picture ← local file URI
```

---

## Error Handling Strategy

```
Network/API Errors
   ├── Timeout (>10s)    → Show "Request timed out. Tap to retry."
   ├── No internet       → Show OfflineBanner + disable API calls
   ├── 401 Unauthorized  → Clear token → Redirect to login
   ├── 4xx Client Error  → Show user-friendly message (no retry)
   └── 5xx Server Error  → Retry up to 3x with exponential backoff

Component Errors
   └── ErrorBoundary wraps root → Catches render errors → Shows fallback UI

WebView Errors
   └── onError prop → Show retry button overlay
```

---

## Performance Considerations

| Area | Strategy |
|---|---|
| Course list | LegendList + React.memo on CourseCard |
| Images | Expo Image with disk caching |
| Search | 300ms debounce, in-memory filter (no extra API call) |
| Re-renders | Split AuthContext from CourseContext |
| API calls | Cache course data in context (don't re-fetch on tab switch) |
| Bookmarks | Optimistic UI update before AsyncStorage write |
