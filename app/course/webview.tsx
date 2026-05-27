import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * WebView Content Viewer — Sprint 3
 * Will render course HTML template via react-native-webview.
 */
export default function WebViewScreen(): React.JSX.Element {
  const { title } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: '#1E293B',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#334155',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
          })}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ color: '#6366F1', fontSize: 16 }}>← Back</Text>
        </Pressable>
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 15,
            fontWeight: '600',
            flex: 1,
          }}
          numberOfLines={1}
        >
          {title ?? 'Course Content'}
        </Text>
      </View>

      {/* Placeholder body */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 56, marginBottom: 16 }}>🌐</Text>
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 8,
          }}
        >
          Coming in Sprint 3
        </Text>
        <Text
          style={{
            color: '#64748B',
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          The WebView content viewer with native ↔ web message passing will be
          implemented in Sprint 3.
        </Text>
      </View>
    </View>
  );
}
