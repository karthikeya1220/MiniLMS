import { apiClient, withRetry } from './client';
import type { ApiResponse } from '../../types/auth';
import type {
  CourseProduct,
  InstructorUser,
  PaginatedData,
} from '../../types/course';

// ─── Courses API ──────────────────────────────────────────────────────────────

export const coursesApi = {
  /**
   * Fetches paginated random products used as course data.
   */
  async fetchProducts(page = 1, limit = 20): Promise<CourseProduct[]> {
    return withRetry(async () => {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<CourseProduct>>
      >('/api/v1/public/randomproducts', {
        params: { page, limit },
      });
      return response.data.data.data;
    });
  },

  /**
   * Fetches paginated random users used as instructor data.
   */
  async fetchInstructors(page = 1, limit = 10): Promise<InstructorUser[]> {
    return withRetry(async () => {
      const response = await apiClient.get<
        ApiResponse<PaginatedData<InstructorUser>>
      >('/api/v1/public/randomusers', {
        params: { page, limit },
      });
      return response.data.data.data;
    });
  },
} as const;
