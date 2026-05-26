import * as SecureStore from 'expo-secure-store';

// SecureStore key — tokens only (respects ~2KB limit per BUGS.md)
const AUTH_TOKEN_KEY = 'auth_token' as const;

export const secureStorage = {
  /**
   * Retrieves the stored JWT access token.
   * Returns null if not set or on any error.
   */
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Persists the JWT access token to the hardware-backed secure store.
   * Never store full user objects here — use AsyncStorage for that.
   */
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },

  /**
   * Removes the stored token (call on logout or 401).
   */
  async deleteToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch {
      // Already absent — treat as success
    }
  },
} as const;
