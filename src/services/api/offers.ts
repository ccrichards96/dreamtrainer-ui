import apiClient, { APIResponse, ApiError } from "./client";
import type {
  CourseOffer,
  CreateCourseOfferData,
  UpdateCourseOfferData,
  OfferApplication,
  MyOfferApplication,
  CourseApplicant,
  ListOffersParams,
} from "../../types/offers";

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
export const getCourseOfferById = async (
  courseId: string,
  offerId: string
): Promise<CourseOffer> => {
  try {
    const response = await apiClient.get<APIResponse<CourseOffer>>(
      `/courses/${courseId}/offers/${offerId}`
    );
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
export const createCourseOffer = async (
  courseId: string,
  data: CreateCourseOfferData
): Promise<CourseOffer> => {
  try {
    const response = await apiClient.post<APIResponse<CourseOffer>>(
      `/courses/${courseId}/offers`,
      data
    );
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
export const updateCourseOffer = async (
  courseId: string,
  offerId: string,
  data: UpdateCourseOfferData
): Promise<CourseOffer> => {
  try {
    const response = await apiClient.put<APIResponse<CourseOffer>>(
      `/courses/${courseId}/offers/${offerId}`,
      data
    );
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

/**
 * Get all active offers on the platform (public/student explore view)
 * GET /offers
 */
export const getOffers = async (params?: ListOffersParams): Promise<Offer[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseOffer[]>>("/offers", { params });
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch offers",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Get the current user's own offer applications (every status), most recent first.
 * GET /offers/me — the source of truth for the user's applied state.
 */
export const getMyApplications = async (): Promise<MyOfferApplication[]> => {
  try {
    const response = await apiClient.get<APIResponse<MyOfferApplication[]>>("/offers/me");
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch your applications",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Apply to an offer as the current user.
 * POST /offers/:offerId/apply
 * Re-applying after a withdrawal/rejection resets the application back to pending.
 */
export const applyToOffer = async (offerId: string): Promise<OfferApplication> => {
  try {
    const response = await apiClient.post<APIResponse<OfferApplication>>(
      `/offers/${offerId}/apply`
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to apply to offer",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Withdraw the current user's application to an offer.
 * DELETE /offers/:offerId/apply
 * Only a pending application can be withdrawn.
 */
export const withdrawApplication = async (offerId: string): Promise<OfferApplication> => {
  try {
    const response = await apiClient.delete<APIResponse<OfferApplication>>(
      `/offers/${offerId}/apply`
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to withdraw application",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Get the pending applicants across all offers for a course (owner/partner/admin only).
 * GET /courses/:courseId/applicants
 */
export const getCourseApplicants = async (courseId: string): Promise<CourseApplicant[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseApplicant[]>>(
      `/courses/${courseId}/applicants`
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch applicants",
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
  getOffers,
  getMyApplications,
  applyToOffer,
  withdrawApplication,
  getCourseApplicants,
};

export default offersService;
