import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCourses } from '../../contexts/CourseContext';

export default function CourseDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCourseById, toggleBookmark } = useCourses();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = id ? getCourseById(id) : undefined;

  const handleBookmark = useCallback(() => {
    if (id) toggleBookmark(id);
  }, [id, toggleBookmark]);

  const handleOpenWebView = useCallback(() => {
    if (!course) return;
    router.push({
      pathname: '/course/webview',
      params: {
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor.fullName,
        thumbnail: course.thumbnail,
      },
    });
  }, [router, course]);

  if (!course) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0F172A',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#94A3B8', fontSize: 16 }}>
          Course not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0F172A' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Thumbnail */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: course.thumbnail }}
          style={{ width: '100%', height: 240 }}
          contentFit="cover"
          transition={300}
        />
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            position: 'absolute',
            top: insets.top + 8,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: pressed
              ? 'rgba(0,0,0,0.8)'
              : 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          })}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ color: '#FFF', fontSize: 18 }}>←</Text>
        </Pressable>
        {/* Bookmark button */}
        <Pressable
          onPress={handleBookmark}
          style={({ pressed }) => ({
            position: 'absolute',
            top: insets.top + 8,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: pressed
              ? 'rgba(0,0,0,0.8)'
              : 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          })}
          accessibilityLabel={course.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>
            {course.isBookmarked ? '🔖' : '🩶'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={{ padding: 20 }}>
        {/* Category + Rating */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View
            style={{
              backgroundColor: '#312E81',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: '#A5B4FC',
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {course.category}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ color: '#FACC15', fontSize: 12 }}>★</Text>
            <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>
              {course.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={{
            color: '#F8FAFC',
            fontSize: 24,
            fontWeight: '800',
            lineHeight: 32,
            marginBottom: 8,
            letterSpacing: -0.3,
          }}
        >
          {course.title}
        </Text>

        {/* Price */}
        <Text
          style={{
            color: '#6366F1',
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 20,
          }}
        >
          ${course.price.toFixed(2)}
        </Text>

        {/* Description */}
        <Text
          style={{
            color: '#94A3B8',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 24,
          }}
        >
          {course.description}
        </Text>

        {/* Instructor */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#1E293B',
            borderRadius: 14,
            padding: 16,
            marginBottom: 28,
          }}
        >
          <Image
            source={{ uri: course.instructor.avatarUrl }}
            style={{ width: 52, height: 52, borderRadius: 26 }}
            contentFit="cover"
            transition={200}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#CBD5E1', fontSize: 11, marginBottom: 2 }}>
              INSTRUCTOR
            </Text>
            <Text
              style={{
                color: '#F8FAFC',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              {course.instructor.fullName}
            </Text>
            <Text style={{ color: '#64748B', fontSize: 13 }}>
              {course.instructor.email}
            </Text>
          </View>
        </View>

        {/* CTA: Start Course */}
        <Pressable
          onPress={handleOpenWebView}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#4F46E5' : '#6366F1',
            borderRadius: 14,
            paddingVertical: 18,
            alignItems: 'center',
          })}
          accessibilityRole="button"
          accessibilityLabel="Start course"
        >
          <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>
            Start Course →
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
