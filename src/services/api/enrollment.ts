import apiClient, { APIResponse } from "./client";
import type { CourseEnrollment } from "../../types/enrollment";

/**
 * Get all enrollments for the current user
 * GET /enrollments/me
 */
export const getUserEnrollments = async (): Promise<CourseEnrollment[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseEnrollment[]>>("/enrollments/me");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch enrollments");
  }
};

/**
 * Check if user is enrolled in a course
 * GET /enrollments/course/:courseId
 */
export const isEnrolledInCourse = async (courseId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<APIResponse<{ enrolled: boolean }>>(
      `/enrollments/course/${courseId}`
    );
    return response.data.data.enrolled;
  } catch (error: any) {
    console.error("Failed to check enrollment:", error);
    return false;
  }
};

/**
 * Enroll in a course
 * POST /enrollments/course/:courseId
 */
export const enrollInCourse = async (courseId: string): Promise<CourseEnrollment> => {
  try {
    const response = await apiClient.post<APIResponse<CourseEnrollment>>(
      `/enrollments/course/${courseId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to enroll in course");
  }
};

const enrollmentService = {
  getUserEnrollments,
  isEnrolledInCourse,
  enrollInCourse,
};

export default enrollmentService;
