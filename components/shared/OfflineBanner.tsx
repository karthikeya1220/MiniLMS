import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * Slides in from the top when the device goes offline.
 * Slides out automatically when connectivity is restored.
 */
export function OfflineBanner(): React.JSX.Element | null {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOffline ? 0 : -60,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [isOffline, slideAnim]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: [{ translateY: slideAnim }],
        backgroundColor: '#7F1D1D',
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
      accessibilityRole="alert"
      accessibilityLabel="You are offline"
    >
      <Text style={{ fontSize: 16 }}>📡</Text>
      <Text
        style={{ color: '#FCA5A5', fontSize: 13, fontWeight: '600', flex: 1 }}
      >
        You&apos;re offline — showing cached content
      </Text>
    </Animated.View>
  );
}
