import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CourseProvider } from '../contexts/CourseContext';
import { requestNotificationPermissions } from '../lib/notifications';

// ─── Auth Guard ───────────────────────────────────────────────────────────────

/**
 * Watches auth state and redirects the user to the correct segment.
 *
 * - While isLoading is true   → renders a centered spinner (splash replacement)
 * - Authenticated + in (auth) → replaces to (tabs)
 * - Not authenticated + in (tabs) or root → replaces to (auth)/login
 */
function AuthGuard(): React.JSX.Element {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Logged-in user landed on an auth screen — push to app
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated user tried to access the app — push to login
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        accessibilityLabel="Loading session"
        accessibilityRole="progressbar"
      >
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return <Slot />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout(): React.JSX.Element {
  useEffect(() => {
    // Request notification permissions once on app start
    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CourseProvider>
          <StatusBar style="auto" />
          <AuthGuard />
        </CourseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
