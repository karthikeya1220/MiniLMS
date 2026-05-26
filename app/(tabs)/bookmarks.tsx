import React from 'react';
import { Text, View } from 'react-native';

/**
 * Bookmarks — Sprint 2
 * Placeholder until bookmark list is implemented.
 */
export default function BookmarksScreen(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
      }}
    >
      <Text style={{ fontSize: 40, marginBottom: 12 }}>🔖</Text>
      <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
        Bookmarks
      </Text>
      <Text style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>
        Your saved courses appear here
      </Text>
    </View>
  );
}
