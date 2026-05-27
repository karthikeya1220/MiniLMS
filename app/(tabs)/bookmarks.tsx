import { LegendList } from '@legendapp/list';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/course/CourseCard';
import { useCourses } from '../../contexts/CourseContext';
import type { Course } from '../../types/course';

// ─── Empty State ──────────────────────────────────────────────────────────────

function BookmarksEmptyState(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 80,
      }}
    >
      <Text style={{ fontSize: 56, marginBottom: 16 }}>🔖</Text>
      <Text
        style={{
          color: '#F8FAFC',
          fontSize: 20,
          fontWeight: '700',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No bookmarks yet
      </Text>
      <Text
        style={{
          color: '#64748B',
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        Tap the bookmark icon on any course to save it here for quick access
      </Text>
      <View
        style={{
          marginTop: 24,
          backgroundColor: '#1E293B',
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: '#6366F1', fontSize: 13, fontWeight: '600' }}>
          🔥 Bookmark 5 courses to unlock a surprise!
        </Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BookmarksScreen(): React.JSX.Element {
  const { bookmarkedCourses, toggleBookmark, isRefreshing, refresh } =
    useCourses();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard course={item} onBookmarkToggle={toggleBookmark} />
    ),
    [toggleBookmark],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <LegendList
        data={bookmarkedCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          bookmarkedCourses.length > 0 ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
              <Text
                style={{
                  color: '#F8FAFC',
                  fontSize: 24,
                  fontWeight: '800',
                  letterSpacing: -0.5,
                }}
              >
                Bookmarks
              </Text>
              <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
                {bookmarkedCourses.length} saved course
                {bookmarkedCourses.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={<BookmarksEmptyState />}
        onRefresh={refresh}
        refreshing={isRefreshing}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        estimatedItemSize={280}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
