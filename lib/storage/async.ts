import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../../types/auth';

// ─── Key Registry ─────────────────────────────────────────────────────────────

export const ASYNC_KEYS = {
  USER_PROFILE: '@lms/user_profile',
  BOOKMARKS: '@lms/bookmarks',
  ENROLLED: '@lms/enrolled',
  PREFERENCES: '@lms/preferences',
  PROFILE_PICTURE: '@lms/profile_picture',
} as const;

export type AsyncKey = (typeof ASYNC_KEYS)[keyof typeof ASYNC_KEYS];

// ─── Storage Helpers ──────────────────────────────────────────────────────────

export const asyncStorage = {
  /**
   * Reads and parses a JSON value by key.
   * Returns null if absent or if parsing fails.
   */
  async get<T>(key: AsyncKey): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Serialises and writes a value by key.
   */
  async set<T>(key: AsyncKey, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Removes a single key.
   */
  async remove(key: AsyncKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Best-effort removal
    }
  },

  /**
   * Clears all LMS-owned keys.
   * Called on logout to ensure a clean slate.
   */
  async clearAll(): Promise<void> {
    const keys = Object.values(ASYNC_KEYS) as string[];
    await AsyncStorage.multiRemove(keys);
  },
} as const;

// ─── Typed Convenience Helpers ────────────────────────────────────────────────

export const userProfileStorage = {
  async get(): Promise<User | null> {
    return asyncStorage.get<User>(ASYNC_KEYS.USER_PROFILE);
  },
  async set(user: User): Promise<void> {
    return asyncStorage.set<User>(ASYNC_KEYS.USER_PROFILE, user);
  },
};

export const bookmarksStorage = {
  async get(): Promise<string[]> {
    return (await asyncStorage.get<string[]>(ASYNC_KEYS.BOOKMARKS)) ?? [];
  },
  async set(ids: string[]): Promise<void> {
    return asyncStorage.set<string[]>(ASYNC_KEYS.BOOKMARKS, ids);
  },
};

export const enrolledStorage = {
  async get(): Promise<string[]> {
    return (await asyncStorage.get<string[]>(ASYNC_KEYS.ENROLLED)) ?? [];
  },
  async set(ids: string[]): Promise<void> {
    return asyncStorage.set<string[]>(ASYNC_KEYS.ENROLLED, ids);
  },
};
