import apiClient, { APIResponse, ApiError } from "./client";
import type { PartnerProfile, UpdatePartnerProfileDTO } from "../../types/partner";

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

/**
 * Update the authenticated user's partner profile.
 * PUT /partners/me
 * @throws ApiError — 404 when the user has no partner profile yet
 */
export const updateMyPartnerProfile = async (
  data: UpdatePartnerProfileDTO
): Promise<PartnerProfile> => {
  try {
    const response = await apiClient.put<APIResponse<PartnerProfile>>("/partners/me", data);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update partner profile",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Upload a partner org logo and get back its hosted URL. Not persisted by
 * this call — pass the returned URL as `logoUrl` on a subsequent profile update.
 * POST /partners/me/logo
 */
export const uploadPartnerLogo = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<APIResponse<{ logoUrl: string }>>(
      "/partners/me/logo",
      formData,
      {
        headers: { "Content-Type": undefined },
        timeout: 60000, // uploads need more headroom than the 10s default
      }
    );
    return response.data.data.logoUrl;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to upload partner logo",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const partnersService = {
  getMyPartnerProfile,
  updateMyPartnerProfile,
  uploadPartnerLogo,
};

export default partnersService;
