import apiClient, { APIResponse, ApiError } from "./client";

export interface CourseOffer {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  status: string;
  requirements?: string[];
  characteristics?: string;
  expectations?: string;
  outcomes?: string;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseOfferData {
  title: string;
  description?: string;
  status?: string;
  requirements?: string[];
  characteristics?: string;
  expectations?: string;
  outcomes?: string;
  expiresAt?: Date | null;
}

export interface UpdateCourseOfferData extends Partial<CreateCourseOfferData> {}

/**
 * Get all offers for a specific course
 */
export const getCourseOffers = async (courseId: string): Promise<CourseOffer[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseOffer[]>>(`/courses/${courseId}/offers`);
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch course offers",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Get a specific course offer by ID
 */
export const getCourseOfferById = async (courseId: string, offerId: string): Promise<CourseOffer> => {
  try {
    const response = await apiClient.get<APIResponse<CourseOffer>>(`/courses/${courseId}/offers/${offerId}`);
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch course offer",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Create a new offer for a specific course
 */
export const createCourseOffer = async (courseId: string, data: CreateCourseOfferData): Promise<CourseOffer> => {
  try {
    const response = await apiClient.post<APIResponse<CourseOffer>>(`/courses/${courseId}/offers`, data);
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to create course offer",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Update an existing course offer
 */
export const updateCourseOffer = async (courseId: string, offerId: string, data: UpdateCourseOfferData): Promise<CourseOffer> => {
  try {
    const response = await apiClient.put<APIResponse<CourseOffer>>(`/courses/${courseId}/offers/${offerId}`, data);
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to update course offer",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Delete a course offer
 */
export const deleteCourseOffer = async (courseId: string, offerId: string): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/offers/${offerId}`);
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to delete course offer",
      status: error.response?.status,
    } as ApiError;
  }
};

const offersService = {
  getCourseOffers,
  getCourseOfferById,
  createCourseOffer,
  updateCourseOffer,
  deleteCourseOffer,
};

export default offersService;
