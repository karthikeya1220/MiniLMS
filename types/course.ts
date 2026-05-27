// ─── Raw API Shapes (from freeapi.app) ───────────────────────────────────────

/** Shape returned by /api/v1/public/randomproducts */
export interface CourseProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

/** Shape returned by /api/v1/public/randomusers */
export interface InstructorUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  location: {
    city: string;
    country: string;
  };
  login: {
    uuid: string;
    username: string;
  };
}

/** Paginated envelope used by both list endpoints */
export interface PaginatedData<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

// ─── App Domain Types ─────────────────────────────────────────────────────────

export interface Instructor {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  country: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  instructor: Instructor;
  isBookmarked: boolean;
}

// ─── Course Context ───────────────────────────────────────────────────────────

export interface CourseContextValue {
  courses: Course[];
  filteredCourses: Course[];
  bookmarkedCourses: Course[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleBookmark: (courseId: string) => Promise<void>;
  refresh: () => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
}
