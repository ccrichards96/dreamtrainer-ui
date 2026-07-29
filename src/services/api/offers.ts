import apiClient, { APIResponse, ApiError } from "./client";
import type {
  CourseOffer,
  CreateCourseOfferData,
  UpdateCourseOfferData,
  OfferApplication,
  OfferApplicationStatus,
  MyOfferApplication,
  CourseApplicant,
  ListOffersParams,
} from "../../types/offers";
import type { Attachment, AttachmentDownload } from "../../types/attachments";

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
 * Upload an image for a course offer and get back its hosted URL.
 * Scoped to the course (not the offer) so it also works while creating a new offer.
 */
export const uploadOfferImage = async (courseId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<APIResponse<{ imageUrl: string }>>(
      `/courses/${courseId}/offers/image`,
      formData,
      {
        headers: { "Content-Type": undefined },
        timeout: 60000, // uploads need more headroom than the 10s default
      }
    );
    return response.data.data.imageUrl;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to upload offer image",
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
export const getOffers = async (params?: ListOffersParams): Promise<CourseOffer[]> => {
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
 * Apply to an offer as the current user, optionally with supporting documents.
 * POST /offers/:offerId/apply
 * Re-applying after a withdrawal/rejection resets the application back to pending
 * and discards the documents submitted with the previous attempt.
 */
export const applyToOffer = async (
  offerId: string,
  documents: File[] = []
): Promise<OfferApplication> => {
  try {
    if (documents.length === 0) {
      const response = await apiClient.post<APIResponse<OfferApplication>>(
        `/offers/${offerId}/apply`
      );
      return response.data.data;
    }

    const formData = new FormData();
    documents.forEach((file) => formData.append("documents", file));

    const response = await apiClient.post<APIResponse<OfferApplication>>(
      `/offers/${offerId}/apply`,
      formData,
      {
        // Let the browser set the multipart boundary rather than the client default.
        headers: { "Content-Type": undefined },
        timeout: 120000, // uploads need more headroom than the 10s default
      }
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

/**
 * Move an applicant to a new pipeline status (owner/partner/admin only).
 * PATCH /courses/:courseId/applicants/:applicationId/status
 */
export const updateApplicantStatus = async (
  courseId: string,
  applicationId: string,
  status: OfferApplicationStatus,
  meetingAt?: string | null
): Promise<CourseApplicant> => {
  try {
    const response = await apiClient.patch<APIResponse<CourseApplicant>>(
      `/courses/${courseId}/applicants/${applicationId}/status`,
      meetingAt === undefined ? { status } : { status, meetingAt }
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to update applicant status",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * List the supporting documents submitted with an application (owner/partner/admin only).
 * GET /courses/:courseId/applicants/:applicationId/documents
 */
export const getApplicantDocuments = async (
  courseId: string,
  applicationId: string
): Promise<Attachment[]> => {
  try {
    const response = await apiClient.get<APIResponse<Attachment[]>>(
      `/courses/${courseId}/applicants/${applicationId}/documents`
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to fetch application documents",
      status: error.response?.status,
    } as ApiError;
  }
};

/**
 * Get a short-lived signed URL for one application document (owner/partner/admin only).
 * GET /courses/:courseId/applicants/:applicationId/documents/:documentId/download
 * Documents are stored privately — this is the only way to read one.
 */
export const getApplicantDocumentDownloadUrl = async (
  courseId: string,
  applicationId: string,
  documentId: string
): Promise<AttachmentDownload> => {
  try {
    const response = await apiClient.get<APIResponse<AttachmentDownload>>(
      `/courses/${courseId}/applicants/${applicationId}/documents/${documentId}/download`
    );
    return response.data.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || "Failed to get document download link",
      status: error.response?.status,
    } as ApiError;
  }
};

const offersService = {
  getCourseOffers,
  getCourseOfferById,
  createCourseOffer,
  updateCourseOffer,
  uploadOfferImage,
  deleteCourseOffer,
  getOffers,
  getMyApplications,
  applyToOffer,
  withdrawApplication,
  getCourseApplicants,
  updateApplicantStatus,
  getApplicantDocuments,
  getApplicantDocumentDownloadUrl,
};

export default offersService;
