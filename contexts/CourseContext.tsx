import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { coursesApi } from '../lib/api/courses';
import { scheduleBookmarkMilestone } from '../lib/notifications';
import { bookmarksStorage } from '../lib/storage/async';
import { useDebounce } from '../hooks/useDebounce';
import type {
  Course,
  CourseContextValue,
  CourseProduct,
  Instructor,
  InstructorUser,
} from '../types/course';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps a raw API product + assigned instructor → app Course model */
function mapToCourse(
  product: CourseProduct,
  instructor: Instructor,
  bookmarkedIds: Set<string>,
): Course {
  return {
    id: product.id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    rating: product.rating,
    category: product.category,
    thumbnail: product.thumbnail,
    images: product.images,
    instructor,
    isBookmarked: bookmarkedIds.has(product.id.toString()),
  };
}

/** Maps a raw random user → app Instructor model */
function mapToInstructor(user: InstructorUser): Instructor {
  return {
    id: user.login.uuid,
    fullName: `${user.name.first} ${user.name.last}`,
    email: user.email,
    avatarUrl: user.picture.medium,
    country: user.location.country,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CourseContext = createContext<CourseContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CourseProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const loadCourses = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      // Fetch instructors + products in parallel
      const [products, users] = await Promise.all([
        coursesApi.fetchProducts(1, 20),
        coursesApi.fetchInstructors(1, 10),
      ]);

      // Load persisted bookmarks
      const bookmarkedIds = new Set(await bookmarksStorage.get());

      // Map instructors
      const instructors = users.map(mapToInstructor);

      // Merge: round-robin assign instructors to courses
      const merged = products.map((product, index) => {
        const instructor = instructors[index % instructors.length];
        // instructor is guaranteed to exist because instructors.length > 0
        // (we fetched at least 1); if somehow empty, we'd catch below
        return mapToCourse(
          product,
          instructor ?? {
            id: 'unknown',
            fullName: 'Unknown Instructor',
            email: '',
            avatarUrl: '',
            country: '',
          },
          bookmarkedIds,
        );
      });

      if (isMounted.current) {
        setCourses(merged);
      }
    } catch {
      if (isMounted.current) {
        setError('Failed to load courses. Pull down to retry.');
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    loadCourses().finally(() => {
      if (!cancelled && isMounted.current) {
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadCourses]);

  // ─── Pull-to-Refresh ────────────────────────────────────────────────────────

  const refresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true);
    await loadCourses();
    setIsRefreshing(false);
  }, [loadCourses]);

  // ─── Search / Filter ────────────────────────────────────────────────────────

  const filteredCourses = useMemo<Course[]>(() => {
    if (!debouncedQuery.trim()) return courses;

    const q = debouncedQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.fullName.toLowerCase().includes(q),
    );
  }, [courses, debouncedQuery]);

  // ─── Bookmarks ──────────────────────────────────────────────────────────────

  const bookmarkedCourses = useMemo<Course[]>(
    () => courses.filter((c) => c.isBookmarked),
    [courses],
  );

  const toggleBookmark = useCallback(
    async (courseId: string): Promise<void> => {
      // Optimistic UI update first (per BUGS.md — state is source of truth)
      let nextBookmarkedCount = 0;

      setCourses((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== courseId) return c;
          return { ...c, isBookmarked: !c.isBookmarked };
        });
        nextBookmarkedCount = updated.filter((c) => c.isBookmarked).length;
        return updated;
      });

      // Persist to AsyncStorage in the background
      const currentIds = await bookmarksStorage.get();
      const idSet = new Set(currentIds);

      if (idSet.has(courseId)) {
        idSet.delete(courseId);
      } else {
        idSet.add(courseId);
      }

      const newIds = Array.from(idSet);
      await bookmarksStorage.set(newIds);

      // Trigger bookmark milestone notification at exactly 5
      if (nextBookmarkedCount === 5) {
        await scheduleBookmarkMilestone();
      }
    },
    [],
  );

  // ─── Utility ────────────────────────────────────────────────────────────────

  const getCourseById = useCallback(
    (id: string): Course | undefined => courses.find((c) => c.id === id),
    [courses],
  );

  // ─── Context Value ──────────────────────────────────────────────────────────

  const value: CourseContextValue = {
    courses,
    filteredCourses,
    bookmarkedCourses,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    toggleBookmark,
    refresh,
    getCourseById,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCourses(): CourseContextValue {
  const context = useContext(CourseContext);
  if (context === null) {
    throw new Error('useCourses() must be used within a <CourseProvider>.');
  }
  return context;
}
