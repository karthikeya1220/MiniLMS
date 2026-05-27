import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Course } from '../../types/course';

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingBadge({ rating }: { rating: number }): React.JSX.Element {
  const stars = Math.round(rating);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 3,
      }}
    >
      <Text style={{ fontSize: 11, color: '#FACC15' }}>
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </Text>
      <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600' }}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}

function CategoryBadge({ category }: { category: string }): React.JSX.Element {
  return (
    <View
      style={{
        backgroundColor: '#312E81',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text
        style={{ fontSize: 11, color: '#A5B4FC', fontWeight: '600', textTransform: 'capitalize' }}
      >
        {category}
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
  onBookmarkToggle: (courseId: string) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

function CourseCardComponent({
  course,
  onBookmarkToggle,
}: CourseCardProps): React.JSX.Element {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/course/[id]',
      params: { id: course.id },
    });
  }, [router, course.id]);

  const handleBookmark = useCallback(() => {
    onBookmarkToggle(course.id);
  }, [onBookmarkToggle, course.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1E293B',
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      })}
      accessibilityRole="button"
      accessibilityLabel={`Open course: ${course.title}`}
    >
      {/* Thumbnail */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: course.thumbnail }}
          style={{ width: '100%', height: 160 }}
          contentFit="cover"
          transition={300}
          recyclingKey={course.id}
        />
        {/* Gradient overlay placeholder — opacity layer */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'transparent',
          }}
        />
        {/* Bookmark button */}
        <Pressable
          onPress={handleBookmark}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 10,
            right: 10,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: pressed
              ? 'rgba(0,0,0,0.7)'
              : 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
          })}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            course.isBookmarked ? 'Remove bookmark' : 'Add bookmark'
          }
        >
          <Text style={{ fontSize: 18 }}>
            {course.isBookmarked ? '🔖' : '🩶'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={{ padding: 14 }}>
        {/* Badges row */}
        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <CategoryBadge category={course.category} />
          <RatingBadge rating={course.rating} />
        </View>

        {/* Title */}
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 16,
            fontWeight: '700',
            lineHeight: 22,
            marginBottom: 6,
          }}
          numberOfLines={2}
        >
          {course.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            color: '#94A3B8',
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 12,
          }}
          numberOfLines={2}
        >
          {course.description}
        </Text>

        {/* Instructor row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: '#334155',
            paddingTop: 10,
          }}
        >
          <Image
            source={{ uri: course.instructor.avatarUrl }}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            contentFit="cover"
            transition={200}
            recyclingKey={course.instructor.id}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: '#CBD5E1', fontSize: 12, fontWeight: '600' }}
              numberOfLines={1}
            >
              {course.instructor.fullName}
            </Text>
            <Text style={{ color: '#64748B', fontSize: 11 }}>
              {course.instructor.country}
            </Text>
          </View>
          <Text style={{ color: '#6366F1', fontSize: 15, fontWeight: '700' }}>
            ${course.price.toFixed(0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Memoised with deep equality on course.id + isBookmarked to prevent
 * re-renders when unrelated courses in the list change.
 */
export const CourseCard = memo(
  CourseCardComponent,
  (prev, next) =>
    prev.course.id === next.course.id &&
    prev.course.isBookmarked === next.course.isBookmarked &&
    prev.onBookmarkToggle === next.onBookmarkToggle,
);
