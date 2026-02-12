import apiClient, { APIResponse } from "./client";

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

export interface AcceptStakeholderResponse {
  id: string;
  courseId: string;
  userId: string;
  role: string;
  dateJoined: string;
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
  inviteStakeholders,
  acceptSupportExpertInvite,
  acceptStakeholderInvite,
};

export default courseInvitesService;
