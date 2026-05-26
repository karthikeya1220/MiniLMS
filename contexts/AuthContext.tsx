import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import { authApi } from '../lib/api/auth';
import { setUnauthorizedHandler } from '../lib/api/client';
import { asyncStorage } from '../lib/storage/async';
import { userProfileStorage } from '../lib/storage/async';
import { secureStorage } from '../lib/storage/secure';
import type {
  AuthContextValue,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Track if the component is still mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ─── Core Auth Helpers ──────────────────────────────────────────────────────

  const clearAuthState = useCallback(async (): Promise<void> => {
    await secureStorage.deleteToken();
    await asyncStorage.clearAll();
    if (isMounted.current) {
      setUser(null);
      setToken(null);
    }
  }, []);

  // ─── Auto-Login on App Start ────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const initAuth = async (): Promise<void> => {
      try {
        const storedToken = await secureStorage.getToken();

        if (!storedToken || cancelled) {
          return;
        }

        // Token found — validate by fetching current user
        const currentUser = await authApi.getCurrentUser();

        if (!cancelled && isMounted.current) {
          setToken(storedToken);
          setUser(currentUser);
          // Keep the cached profile fresh
          await userProfileStorage.set(currentUser);
        }
      } catch {
        // Token invalid or network failure — clear everything
        if (!cancelled) {
          await clearAuthState();
        }
      } finally {
        if (!cancelled && isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [clearAuthState]);

  // ─── Wire 401 Handler into Axios Client ────────────────────────────────────

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearAuthState();
      router.replace('/(auth)/login');
    });
  }, [clearAuthState, router]);

  // ─── Auth Actions ───────────────────────────────────────────────────────────

  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      const data = await authApi.login(credentials);

      await secureStorage.setToken(data.accessToken);
      await userProfileStorage.set(data.user);

      setToken(data.accessToken);
      setUser(data.user);

      router.replace('/(tabs)');
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      await authApi.register(data);
      // Auto-login after successful registration
      await login({ username: data.username, password: data.password });
    },
    [login],
  );

  const logout = useCallback(async (): Promise<void> => {
    await clearAuthState();
    router.replace('/(auth)/login');
  }, [clearAuthState, router]);

  // ─── Context Value ──────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: user !== null && token !== null,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Consume auth state and actions inside any screen or component.
 * Must be rendered within <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth() must be used within an <AuthProvider>.');
  }
  return context;
}
