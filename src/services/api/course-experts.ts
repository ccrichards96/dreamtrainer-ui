import apiClient, { APIResponse, ApiError } from "./client";
import { CourseExpert } from "../../types/modules";

export interface CreateCourseExpertDTO {
  expertProfileId: string;
  courseId: string;
  role: "owner" | "support-expert";
}

export interface UpdateCourseExpertDTO {
  role: "owner" | "support-expert";
}

/**
 * Create a new course expert (Admin only)
 * POST /course-experts
 */
export const createCourseExpert = async (data: CreateCourseExpertDTO): Promise<CourseExpert> => {
  try {
    const response = await apiClient.post<APIResponse<CourseExpert>>(`/course-experts`, data);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to assign course expert",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all experts for a specific course (Admin only)
 * GET /course-experts/course/:courseId
 */
export const getExpertsByCourse = async (courseId: string): Promise<CourseExpert[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseExpert[]>>(
      `/course-experts/course/${courseId}`
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course experts",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Update a course expert's role (Admin only)
 * PUT /course-experts/:id
 */
export const updateCourseExpert = async (
  id: string,
  data: UpdateCourseExpertDTO
): Promise<CourseExpert> => {
  try {
    const response = await apiClient.put<APIResponse<CourseExpert>>(`/course-experts/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update course expert",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Remove a course expert (Admin only)
 * DELETE /course-experts/:id
 */
export const deleteCourseExpert = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/course-experts/${id}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to remove course expert",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const courseExpertsService = {
  createCourseExpert,
  getExpertsByCourse,
  updateCourseExpert,
  deleteCourseExpert,
};

export default courseExpertsService;
