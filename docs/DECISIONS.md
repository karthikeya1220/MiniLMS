# DECISIONS.md

> Document WHY decisions were made. Prevents revisiting settled choices.
> Add an entry every time you make a meaningful technical choice.

---

## Auth Token Storage: SecureStore over AsyncStorage

**Decision:** Use `expo-secure-store` for JWT tokens.

**Reason:**
SecureStore uses iOS Keychain and Android Keystore — hardware-backed encryption. AsyncStorage is plaintext on disk. Tokens are sensitive credentials; storing them in plaintext is a security anti-pattern.

**Tradeoff:**
SecureStore has a ~2KB value size limit. Not suitable for storing large blobs. Tokens are small, so this is fine.

**Rejected Alternative:** AsyncStorage for everything — rejected due to plaintext storage risk.

---

## App Data Storage: AsyncStorage over MMKV

**Decision:** Use `@react-native-async-storage/async-storage` for bookmarks, enrolled courses, preferences.

**Reason:**
AsyncStorage is the Expo-managed default with good community support and zero native config required. MMKV is faster but requires a native build step (not available in Expo Go without dev build).

**Tradeoff:**
MMKV is 10x faster for synchronous reads. For this app's data scale (small JSON objects), the difference is imperceptible.

**Revisit If:** App data grows large or frequent synchronous reads become a bottleneck.

---

## Navigation: Expo Router over React Navigation

**Decision:** Use Expo Router for all navigation.

**Reason:**
File-based routing reduces boilerplate and is the Expo-recommended approach. The `(auth)` and `(tabs)` group syntax maps cleanly to the LMS structure. Deep linking is automatic.

**Tradeoff:**
Less fine-grained control vs. manual React Navigation setup. Edge cases (e.g., complex modal stacks) need extra handling.

---

## State Management: React Context + Hooks (no Redux/Zustand)

**Decision:** Manage global state via Context API (`AuthContext`, `CourseContext`).

**Reason:**
The app has two main global concerns: auth state and course/bookmark state. These don't require the complexity of Redux or Zustand. Context + custom hooks is sufficient, more readable, and keeps bundle size small.

**Tradeoff:**
Context re-renders can be an issue if not split properly. Solution: separate `AuthContext` from `CourseContext` so auth changes don't re-render the entire course list.

**Rejected Alternative:** Zustand — rejected to keep dependencies minimal; revisit if state grows complex.

---

## List Rendering: LegendList over FlatList

**Decision:** Use `@legendapp/list` (LegendList) for course catalog.

**Reason:**
Assignment explicitly requires LegendList. It offers better recycling and avoids FlatList's blank-cell jank on fast scroll, especially with image-heavy course cards.

**Tradeoff:**
Smaller community than FlatList. Fewer Stack Overflow answers. Mitigated by docs being clear.

---

## HTTP Client: Axios over Fetch

**Decision:** Use Axios for all API calls.

**Reason:**
Axios provides interceptors natively — critical for injecting auth headers and handling 401 responses centrally. Implementing the same with `fetch` requires manual wrapper boilerplate.

**Tradeoff:**
Adds ~15KB to bundle. Acceptable for the reliability gain.

**Interceptor Strategy:**
- **Request interceptor:** Read token from SecureStore, attach as `Authorization: Bearer <token>`
- **Response interceptor:** On 401, attempt token refresh; on failure, redirect to login

---

## WebView Content: Local HTML Template over Remote URL

**Decision:** Render course content in WebView using a locally injected HTML template, not a remote URL.

**Reason:**
The free API (`freeapi.app`) doesn't provide a web-renderable course content page. A local template gives full control over styling, allows native → WebView message passing, and works offline.

**Implementation:**
Use `injectedJavaScript` to pass course data from native → WebView on load.

---

## Styling: NativeWind over StyleSheet

**Decision:** Use NativeWind (Tailwind for React Native) as primary styling method.

**Reason:**
Assignment mandates NativeWind. It also speeds up UI development significantly with utility classes and enforces consistent spacing/color system.

**Tradeoff:**
Custom native animations still require `StyleSheet` or Reanimated. NativeWind is for static styles.

---

## Notifications: expo-notifications Foreground + Background

**Decision:** Use `expo-notifications` for all notification logic.

**Reason:**
Expo-managed, no native config needed. Supports scheduling (for 24hr reminder) and immediate triggers (for bookmark milestone).

**Tradeoff:**
24hr background task scheduling on iOS requires specific permissions and may be delayed by OS. Documented as known limitation.
