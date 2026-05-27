import { LegendList } from '@legendapp/list';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourseCard } from '../../components/course/CourseCard';
import { OfflineBanner } from '../../components/shared/OfflineBanner';
import { useCourses } from '../../contexts/CourseContext';
import type { Course } from '../../types/course';

// ─── Search Bar ───────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

function SearchBar({
  value,
  onChangeText,
  onClear,
}: SearchBarProps): React.JSX.Element {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: '#334155',
      }}
    >
      <Text style={{ fontSize: 16, color: '#64748B' }}>🔍</Text>
      <TextInput
        style={{
          flex: 1,
          color: '#F8FAFC',
          fontSize: 15,
          paddingVertical: 12,
        }}
        placeholder="Search courses, instructors..."
        placeholderTextColor="#64748B"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        accessibilityLabel="Search courses"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Clear search">
          <Text style={{ fontSize: 18, color: '#64748B' }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={{ color: '#64748B', fontSize: 14, marginTop: 12 }}>
        Loading courses...
      </Text>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasQuery }: { hasQuery: boolean }): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
      <Text style={{ fontSize: 48, marginBottom: 12 }}>
        {hasQuery ? '🔍' : '📭'}
      </Text>
      <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600', marginBottom: 6 }}>
        {hasQuery ? 'No results found' : 'No courses yet'}
      </Text>
      <Text style={{ color: '#64748B', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 }}>
        {hasQuery
          ? 'Try a different search term'
          : 'Pull down to refresh the catalog'}
      </Text>
    </View>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Text style={{ fontSize: 48, marginBottom: 12 }}>⚠️</Text>
      <Text
        style={{
          color: '#F8FAFC',
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          color: '#64748B',
          fontSize: 14,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#4F46E5' : '#6366F1',
          borderRadius: 10,
          paddingHorizontal: 28,
          paddingVertical: 12,
        })}
        accessibilityRole="button"
        accessibilityLabel="Retry loading courses"
      >
        <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
          Retry
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CourseCatalogScreen(): React.JSX.Element {
  const {
    filteredCourses,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    toggleBookmark,
    refresh,
  } = useCourses();

  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard course={item} onBookmarkToggle={toggleBookmark} />
    ),
    [toggleBookmark],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const handleClear = useCallback(() => setSearchQuery(''), [setSearchQuery]);

  const renderHeader = useCallback(
    () => (
      <View style={{ paddingTop: 16 }}>
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 24,
            fontWeight: '800',
            paddingHorizontal: 16,
            marginBottom: 14,
            letterSpacing: -0.5,
          }}
        >
          Explore Courses
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClear}
        />
        {filteredCourses.length > 0 && (
          <Text
            style={{
              color: '#64748B',
              fontSize: 12,
              paddingHorizontal: 16,
              marginBottom: 4,
            }}
          >
            {filteredCourses.length} course
            {filteredCourses.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>
    ),
    [searchQuery, setSearchQuery, handleClear, filteredCourses.length],
  );

  const renderEmpty = useCallback(
    () =>
      error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <EmptyState hasQuery={searchQuery.length > 0} />
      ),
    [error, refresh, searchQuery.length],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
        <OfflineBanner />
        <LoadingSkeleton />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <OfflineBanner />
      <LegendList
        data={filteredCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        onRefresh={refresh}
        refreshing={isRefreshing}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        estimatedItemSize={280}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
