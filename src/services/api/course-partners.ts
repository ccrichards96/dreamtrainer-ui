import apiClient, { APIResponse, ApiError } from "./client";
import { CoursePartner } from "../../types/modules";
import { PartnerCourseRole } from "../../types/partner";

export interface CreateCoursePartnerDTO {
  partnerProfileId: string;
  courseId: string;
  role: PartnerCourseRole;
}

export interface UpdateCoursePartnerDTO {
  role: PartnerCourseRole;
}

/**
 * Create a new course partner (Admin only)
 * POST /course-partners
 */
export const createCoursePartner = async (
  data: CreateCoursePartnerDTO
): Promise<CoursePartner> => {
  try {
    const response = await apiClient.post<APIResponse<CoursePartner>>(`/course-partners`, data);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to assign course partner",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all partners for a specific course (Admin only)
 * GET /course-partners/course/:courseId
 */
export const getPartnersByCourse = async (courseId: string): Promise<CoursePartner[]> => {
  try {
    const response = await apiClient.get<APIResponse<CoursePartner[]>>(
      `/course-partners/course/${courseId}`
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course partners",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Update a course partner's role (Admin only)
 * PUT /course-partners/:id
 */
export const updateCoursePartner = async (
  id: string,
  data: UpdateCoursePartnerDTO
): Promise<CoursePartner> => {
  try {
    const response = await apiClient.put<APIResponse<CoursePartner>>(
      `/course-partners/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update course partner",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Remove a course partner (Admin only)
 * DELETE /course-partners/:id
 */
export const deleteCoursePartner = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/course-partners/${id}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to remove course partner",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const coursePartnersService = {
  createCoursePartner,
  getPartnersByCourse,
  updateCoursePartner,
  deleteCoursePartner,
};

export default coursePartnersService;
