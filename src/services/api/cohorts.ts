import apiClient, { APIResponse, ApiError } from "./client";
import type {
  Cohort,
  CohortMember,
  CohortMemberStatus,
  CreateCohortDTO,
  UpdateCohortDTO,
} from "../../types/cohorts";

/** Wraps an axios error into the app's ApiError shape with a fallback message. */
const toApiError = (error: any, fallback: string): ApiError => ({
  message: error.response?.data?.message || fallback,
  status: error.response?.status,
});

/**
 * Create a cohort.
 * POST /cohorts — roles: admin, institution
 */
export const createCohort = async (data: CreateCohortDTO): Promise<Cohort> => {
  try {
    const response = await apiClient.post<APIResponse<Cohort>>("/cohorts", data);
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to create cohort");
  }
};

/**
 * List cohorts visible to the caller (admin: all; others: own).
 * GET /cohorts
 * @param courseId - Optional filter by course
 */
export const listCohorts = async (courseId?: string): Promise<Cohort[]> => {
  try {
    const response = await apiClient.get<APIResponse<Cohort[]>>("/cohorts", {
      params: courseId ? { courseId } : undefined,
    });
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to fetch cohorts");
  }
};

/**
 * List all cohorts for a course (not scoped by ownership).
 * GET /cohorts/course/:courseId
 */
export const listCohortsByCourse = async (courseId: string): Promise<Cohort[]> => {
  try {
    const response = await apiClient.get<APIResponse<Cohort[]>>(`/cohorts/course/${courseId}`);
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to fetch cohorts for course");
  }
};

/**
 * Get a single cohort including course, creator, and members.
 * GET /cohorts/:id — manage permission required
 */
export const getCohortById = async (id: string): Promise<Cohort> => {
  try {
    const response = await apiClient.get<APIResponse<Cohort>>(`/cohorts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to fetch cohort");
  }
};

/**
 * Partially update a cohort.
 * PUT /cohorts/:id — manage permission required
 */
export const updateCohort = async (id: string, data: UpdateCohortDTO): Promise<Cohort> => {
  try {
    const response = await apiClient.put<APIResponse<Cohort>>(`/cohorts/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to update cohort");
  }
};

/**
 * Soft-delete a cohort.
 * DELETE /cohorts/:id — manage permission required
 * @returns The success message (no data payload)
 */
export const deleteCohort = async (id: string): Promise<string> => {
  try {
    const response = await apiClient.delete<APIResponse<null>>(`/cohorts/${id}`);
    return response.data.message;
  } catch (error: any) {
    throw toApiError(error, "Failed to delete cohort");
  }
};

// ----- Membership -----

/**
 * List a cohort's members (each includes user).
 * GET /cohorts/:id/members — manage permission required
 */
export const listCohortMembers = async (cohortId: string): Promise<CohortMember[]> => {
  try {
    const response = await apiClient.get<APIResponse<CohortMember[]>>(
      `/cohorts/${cohortId}/members`
    );
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to fetch cohort members");
  }
};

/**
 * Add one or more members to a cohort. Re-activates existing rows rather than
 * duplicating. Accepts a single user id or an array.
 * POST /cohorts/:id/members — manage permission required
 */
export const addCohortMembers = async (
  cohortId: string,
  userIds: string | string[]
): Promise<CohortMember[]> => {
  try {
    const body = Array.isArray(userIds) ? { userIds } : { userId: userIds };
    const response = await apiClient.post<APIResponse<CohortMember[]>>(
      `/cohorts/${cohortId}/members`,
      body
    );
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to add cohort members");
  }
};

/**
 * Update a member's status. Note: `memberUserId` is the user id, not the row id.
 * PATCH /cohorts/:id/members/:memberUserId — manage permission required
 */
export const updateCohortMemberStatus = async (
  cohortId: string,
  memberUserId: string,
  status: CohortMemberStatus
): Promise<CohortMember> => {
  try {
    const response = await apiClient.patch<APIResponse<CohortMember>>(
      `/cohorts/${cohortId}/members/${memberUserId}`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to update member status");
  }
};

/**
 * Soft-remove a member (status: 'removed', keeps history).
 * DELETE /cohorts/:id/members/:memberUserId — manage permission required
 */
export const removeCohortMember = async (
  cohortId: string,
  memberUserId: string
): Promise<CohortMember> => {
  try {
    const response = await apiClient.delete<APIResponse<CohortMember>>(
      `/cohorts/${cohortId}/members/${memberUserId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw toApiError(error, "Failed to remove cohort member");
  }
};

const cohortsService = {
  createCohort,
  listCohorts,
  listCohortsByCourse,
  getCohortById,
  updateCohort,
  deleteCohort,
  listCohortMembers,
  addCohortMembers,
  updateCohortMemberStatus,
  removeCohortMember,
};

export default cohortsService;
