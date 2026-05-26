import React from 'react';
import { Text, View } from 'react-native';

/**
 * Course Catalog — Sprint 2
 * Placeholder: LegendList + CourseCard + Search implemented in Sprint 2.
 */
export default function CourseCatalogScreen(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
      }}
    >
      <Text style={{ fontSize: 40, marginBottom: 12 }}>📚</Text>
      <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
        Course Catalog
      </Text>
      <Text style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>
        Sprint 2 — coming next
      </Text>
    </View>
  );
}
