import apiClient, { APIResponse, ApiError } from "./client";
import type { CourseProgress, UpdateProgressDTO } from "../../types/course-progress";

// Course Progress API service
export const courseProgressApi = {
  /**
   * Get all course progress for the authenticated user
   * GET /progress
   */
  async getUserAllProgress(): Promise<CourseProgress[]> {
    try {
      const response = await apiClient.get<APIResponse<CourseProgress[]>>("/progress");
      return response.data.data || [];
    } catch (error: unknown) {
      const apiError: ApiError = {
        message:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch progress",
        status: (error as { response?: { status?: number } })?.response?.status,
      };
      throw apiError;
    }
  },

  /**
   * Get specific course progress for the authenticated user
   * GET /progress/{courseId}
   */
  async getUserCourseProgress(courseId: string): Promise<CourseProgress> {
    try {
      const response = await apiClient.get<APIResponse<CourseProgress>>(`/progress/${courseId}`);
      return response.data.data;
    } catch (error: unknown) {
      const apiError: ApiError = {
        message:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch course progress",
        status: (error as { response?: { status?: number } })?.response?.status,
      };
      throw apiError;
    }
  },

  /**
   * Start a course
   * POST /progress/{courseId}/start
   */
  async startCourse(courseId: string): Promise<CourseProgress> {
    try {
      const response = await apiClient.post<APIResponse<CourseProgress>>(
        `/progress/${courseId}/start`
      );
      return response.data.data;
    } catch (error: unknown) {
      const apiError: ApiError = {
        message:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to start course",
        status: (error as { response?: { status?: number } })?.response?.status,
      };
      throw apiError;
    }
  },

  /**
   * Update course progress
   * PUT /progress/{courseId}
   */
  async updateProgress(courseId: string, progressData: UpdateProgressDTO): Promise<CourseProgress> {
    try {
      const response = await apiClient.put<APIResponse<CourseProgress>>(
        `/progress/${courseId}`,
        progressData
      );
      return response.data.data;
    } catch (error: unknown) {
      const apiError: ApiError = {
        message:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update progress",
        status: (error as { response?: { status?: number } })?.response?.status,
      };
      throw apiError;
    }
  },

  /**
   * Mark course as completed
   * POST /progress/{courseId}/complete
   */
  async completeCourse(courseId: string): Promise<CourseProgress> {
    try {
      const response = await apiClient.post<APIResponse<CourseProgress>>(
        `/progress/${courseId}/complete`
      );
      return response.data.data;
    } catch (error: unknown) {
      const apiError: ApiError = {
        message:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to complete course",
        status: (error as { response?: { status?: number } })?.response?.status,
      };
      throw apiError;
    }
  },
};

// Export individual functions for convenience
export const {
  getUserAllProgress,
  getUserCourseProgress,
  startCourse,
  updateProgress,
  completeCourse,
} = courseProgressApi;

export default courseProgressApi;
