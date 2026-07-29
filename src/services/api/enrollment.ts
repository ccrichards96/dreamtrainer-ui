import apiClient, { APIResponse } from "./client";
import type {
  CourseEnrollment,
  CourseStudent,
  CourseStudentStatus,
  ListCourseStudentsParams,
  PaginatedCourseStudentsResponse,
} from "../../types/enrollment";

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

/**
 * Enroll in a free course (no Stripe checkout required)
 * POST /enrollments/enroll
 * Backend verifies the course is free ($0) before creating enrollment
 */
export const enrollInFreeCourse = async (courseId: string): Promise<CourseEnrollment> => {
  try {
    const response = await apiClient.post<APIResponse<CourseEnrollment>>("/enrollments/enroll", {
      courseId,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to enroll in free course");
  }
};

export const listCourseStudents = async (
  courseId: string,
  params?: ListCourseStudentsParams
): Promise<PaginatedCourseStudentsResponse> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: CourseStudent[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }>(`/courses/${courseId}/students`, { params });
    return { data: response.data.data, meta: response.data.meta };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch course students");
  }
};

export const listCourseStudentLeaders = async (
  courseId: string,
  params?: ListCourseStudentsParams
): Promise<PaginatedCourseStudentsResponse> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: CourseStudent[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }>(`/courses/${courseId}/student-leaders`, { params });
    return { data: response.data.data, meta: response.data.meta };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch student leaders");
  }
};

/**
 * Set a course student's pass state.
 * PATCH /courses/:courseId/students/:studentId/status
 *
 * Marking a student as passed triggers the course-passed email on the backend.
 */
export const updateCourseStudentStatus = async (
  courseId: string,
  studentId: string,
  status: CourseStudentStatus
): Promise<CourseStudent> => {
  try {
    const response = await apiClient.patch<APIResponse<CourseStudent>>(
      `/courses/${courseId}/students/${studentId}/status`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update student status");
  }
};

const enrollmentService = {
  getUserEnrollments,
  isEnrolledInCourse,
  enrollInCourse,
  listCourseStudents,
  listCourseStudentLeaders,
  updateCourseStudentStatus,
};

export default enrollmentService;
