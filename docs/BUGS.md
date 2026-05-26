# BUGS.md

> Your personal debugging database.
> Log every non-trivial bug + fix so you never solve the same problem twice.

---

## Template

```
## [Short Bug Title]

**Where:** File/screen/component
**Symptom:** What you saw
**Cause:** What actually went wrong
**Fix:** How you solved it
**Prevention:** How to avoid in future
```

---

## Known Expo / React Native Gotchas (Pre-filled)

---

## SecureStore: "Value too large" Error

**Where:** `lib/storage/secure.ts`
**Symptom:** App crashes when storing large objects in SecureStore
**Cause:** SecureStore has a ~2048 byte limit per key
**Fix:** Only store the raw JWT string, never a full user object. Store user data in AsyncStorage.
**Prevention:** Rule: SecureStore = tokens only. Everything else → AsyncStorage.

---

## NativeWind: Classes Not Applying

**Where:** Any component using NativeWind
**Symptom:** Tailwind classes appear in code but have no visual effect
**Cause:** NativeWind requires `className` prop and babel plugin to be configured correctly
**Fix:**
1. Ensure `babel.config.js` includes `"nativewind/babel"` plugin
2. Import `nativewind/types` in `app.d.ts` or `global.d.ts`
3. Restart Metro bundler after config changes (`npx expo start -c`)
**Prevention:** Always restart with cache clear after any config change.

---

## Expo Router: Deep Link Not Matching

**Where:** `app/course/[id].tsx`
**Symptom:** Navigating to course detail crashes or shows wrong screen
**Cause:** Dynamic route param accessed as `params.id` but Expo Router may use `useLocalSearchParams()`
**Fix:** Use `const { id } = useLocalSearchParams<{ id: string }>()` instead of `useSearchParams`
**Prevention:** Always use `useLocalSearchParams` for dynamic segments in Expo Router.

---

## AsyncStorage: Stale State After Write

**Where:** Bookmark toggle
**Symptom:** Bookmark icon doesn't update immediately after tap, shows old value
**Cause:** AsyncStorage write is async; UI reads from context state, not directly from storage
**Fix:** Update context state optimistically FIRST, then write to AsyncStorage in background
**Prevention:** Always treat AsyncStorage as persistence layer, not source of truth. State is source of truth.

---

## expo-notifications: No Notification on iOS Simulator

**Where:** Notification scheduling
**Symptom:** Notification never appears during testing
**Cause:** iOS Simulator doesn't support push notifications. Local notifications also unreliable on some simulator versions.
**Fix:** Test notifications on a physical iOS device
**Prevention:** Document this as a known limitation. Always test notification flows on real device.

---

## LegendList: Items Not Recycling Correctly

**Where:** Course catalog list
**Symptom:** Course cards show wrong data after fast scrolling (content from other cards bleeds in)
**Cause:** Missing stable `keyExtractor` or mutable keys causing recycler pool confusion
**Fix:** Ensure `keyExtractor={(item) => item.id.toString()}` returns a truly unique, stable string
**Prevention:** Never use array index as key in dynamic lists.

---

## Axios Interceptor: Infinite Retry Loop on 401

**Where:** `lib/api/client.ts`
**Symptom:** App freezes, console shows hundreds of API calls on auth failure
**Cause:** Response interceptor triggers refresh → refresh also returns 401 → interceptor triggers again
**Fix:** Add a `_retry` flag to the request config; skip interceptor if `_retry === true`
```ts
axiosInstance.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    // attempt refresh or logout
  }
  return Promise.reject(error);
});
```
**Prevention:** Always guard refresh logic with a `_retry` flag.

---

## Add New Bugs Below This Line

---
