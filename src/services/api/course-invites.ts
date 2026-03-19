import apiClient, { APIResponse } from "./client";
import axios from "axios";

export interface CourseInvite {
  id: string;
  courseId: string;
  email: string;
  role: "support_expert" | "stakeholder";
  token: string;
  status: "pending" | "accepted" | "expired";
  stakeholderRole: "viewer" | "reviewer" | "collaborator" | null;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcceptSupportExpertResponse {
  id: string;
  expertProfileId: string;
  courseId: string;
  role: "support-expert";
}

export interface CourseExpert {
  id: string;
  expertProfileId: string;
  courseId: string;
  role: string;
  dateJoined: string;
  expertProfile?: {
    id: string;
    displayName: string;
    slug: string;
    avatarUrl: string | null;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface AcceptStakeholderResponse {
  id: string;
  courseId: string;
  userId: string;
  role: string;
  dateJoined: string;
}

export interface CourseStakeholder {
  id: string;
  courseId: string;
  userId: string;
  role: string;
  dateJoined: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export type StakeholderRole = "viewer" | "reviewer" | "collaborator";

export const inviteSupportExperts = async (
  courseId: string,
  emails: string[]
): Promise<CourseInvite[]> => {
  try {
    const response = await apiClient.post<APIResponse<CourseInvite[]>>(
      `/courses/${courseId}/invite/support-experts`,
      { emails }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send expert invitations: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while sending invitations");
  }
};

/**
 * Get all support expert invites for a course
 * GET /courses/:courseId/invites/experts
 */
export const getSupportExpertInvites = async (courseId: string): Promise<CourseInvite[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseInvite[]>>(
      `/courses/${courseId}/invites/experts`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch support expert invites: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching invites");
  }
};

/**
 * Get all course experts with their expert profiles
 * GET /courses/:courseId/experts
 */
export const getCourseExperts = async (courseId: string): Promise<CourseExpert[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseExpert[]>>(
      `/courses/${courseId}/experts`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch course experts: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching course experts");
  }
};

/**
 * Delete / revoke a support expert invite
 * DELETE /courses/:courseId/invite/support-experts/:inviteId
 */
export const deleteSupportExpertInvite = async (
  courseId: string,
  inviteId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/invite/support-experts/${inviteId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove support expert: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while removing support expert");
  }
};

/**
 * Get all stakeholder invites for a course
 * GET /courses/:courseId/invites/stakeholders
 */
export const getStakeholderInvites = async (courseId: string): Promise<CourseInvite[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseInvite[]>>(
      `/courses/${courseId}/invites/stakeholders`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch stakeholder invites: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching invites");
  }
};

/**
 * Get all established stakeholders for a course
 * GET /courses/:courseId/stakeholders
 */
export const getCourseStakeholders = async (courseId: string): Promise<CourseStakeholder[]> => {
  try {
    const response = await apiClient.get<APIResponse<CourseStakeholder[]>>(
      `/courses/${courseId}/stakeholders`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch course stakeholders: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching course stakeholders");
  }
};

/**
 * Delete / revoke a stakeholder invite
 * DELETE /courses/:courseId/invite/stakeholders/:inviteId
 */
export const deleteStakeholderInvite = async (
  courseId: string,
  inviteId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/invite/stakeholders/${inviteId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove stakeholder invite: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while removing stakeholder invite");
  }
};

export const inviteStakeholders = async (
  courseId: string,
  emails: string[],
  stakeholderRole: StakeholderRole = "viewer"
): Promise<CourseInvite[]> => {
  try {
    const response = await apiClient.post<APIResponse<CourseInvite[]>>(
      `/courses/${courseId}/invite/stakeholders`,
      { emails, stakeholderRole }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send stakeholder invitations: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while sending invitations");
  }
};

export const acceptSupportExpertInvite = async (
  token: string
): Promise<AcceptSupportExpertResponse> => {
  try {
    const response = await apiClient.post<APIResponse<AcceptSupportExpertResponse>>(
      `/courses/invite/accept-support-expert`,
      { token }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error accepting support expert invite:", error);
      throw new Error(
        `Failed to accept invite: ${error?.response?.data?.message || error.message}`
      );
    }
    if (error instanceof Error) {
      throw new Error(`Failed to accept invite: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while accepting invite");
  }
};

export const acceptStakeholderInvite = async (
  token: string
): Promise<AcceptStakeholderResponse> => {
  try {
    const response = await apiClient.post<APIResponse<AcceptStakeholderResponse>>(
      `/courses/invite/accept-stakeholder`,
      { token }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to accept invite: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while accepting invite");
  }
};

export const courseInvitesService = {
  inviteSupportExperts,
  getSupportExpertInvites,
  getCourseExperts,
  deleteSupportExpertInvite,
  getStakeholderInvites,
  getCourseStakeholders,
  deleteStakeholderInvite,
  inviteStakeholders,
  acceptSupportExpertInvite,
  acceptStakeholderInvite,
};

export default courseInvitesService;
