import apiClient, { APIResponse, ApiError } from "./client";
import type { PartnerProfile } from "../../types/partner";

/**
 * Get the authenticated user's partner profile (including assigned courses).
 * GET /partners/me
 * @returns Promise<PartnerProfile>
 * @throws ApiError — 404 when the user has no partner profile
 */
export const getMyPartnerProfile = async (): Promise<PartnerProfile> => {
  try {
    const response = await apiClient.get<APIResponse<PartnerProfile>>("/partners/me");
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch partner profile",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const partnersService = {
  getMyPartnerProfile,
};

export default partnersService;
