import apiClient, { APIResponse, ApiError } from "./client";
import { CourseLevel } from "../../types/modules";
import type { CourseStudent } from "../../types/enrollment";

export interface CreateCourseLevelDTO {
  name: string;
  order: number;
}

export interface UpdateCourseLevelDTO {
  name?: string;
  order?: number;
}

export interface DeleteCourseLevelOptions {
  reassignToLevelId?: string;
}

/**
 * Get all levels for a course, sorted by order ascending
 * GET /courses/:courseId/levels
 */
export const getLevelsByCourse = async (courseId: string): Promise<CourseLevel[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseLevel[]>>(
      `/courses/${courseId}/levels`
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course levels",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Create a new level for a course (owner or admin only)
 * POST /courses/:courseId/levels
 */
export const createCourseLevel = async (
  courseId: string,
  data: CreateCourseLevelDTO
): Promise<CourseLevel> => {
  try {
    const response = await apiClient.post<APIResponse<CourseLevel>>(
      `/courses/${courseId}/levels`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to create course level",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Update a course level's name and/or order (owner or admin only)
 * PUT /courses/:courseId/levels/:levelId
 */
export const updateCourseLevel = async (
  courseId: string,
  levelId: string,
  data: UpdateCourseLevelDTO
): Promise<CourseLevel> => {
  try {
    const response = await apiClient.put<APIResponse<CourseLevel>>(
      `/courses/${courseId}/levels/${levelId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update course level",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Delete a course level (owner or admin only). If students are assigned to
 * this level, the API responds 400 and requires `reassignToLevelId` naming
 * another level in the same course to move them to before deleting.
 * DELETE /courses/:courseId/levels/:levelId
 */
export const deleteCourseLevel = async (
  courseId: string,
  levelId: string,
  options?: DeleteCourseLevelOptions
): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/levels/${levelId}`, {
      data: options?.reassignToLevelId
        ? { reassignToLevelId: options.reassignToLevelId }
        : undefined,
    });
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to delete course level",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Assign a course level to a student, or pass `null` to clear it.
 * PATCH /courses/:courseId/levels/students/:studentId
 */
export const assignStudentLevel = async (
  courseId: string,
  studentId: string,
  courseLevelId: string | null
): Promise<CourseStudent> => {
  try {
    const response = await apiClient.patch<APIResponse<CourseStudent>>(
      `/courses/${courseId}/levels/students/${studentId}`,
      { courseLevelId }
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to assign student level",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const courseLevelsService = {
  getLevelsByCourse,
  createCourseLevel,
  updateCourseLevel,
  deleteCourseLevel,
  assignStudentLevel,
};

export default courseLevelsService;
