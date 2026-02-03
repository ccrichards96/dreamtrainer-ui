import apiClient, { APIResponse, ApiError } from "./client";
import type { ExpertProfile } from "../../types/modules";

/**
 * Get expert profile by slug (public endpoint)
 * GET /experts/:slug/public
 * @param slug - The slug of the expert profile
 * @returns Promise<ExpertProfile>
 */
export const getExpertBySlug = async (slug: string): Promise<ExpertProfile> => {
  try {
    const response = await apiClient.get<APIResponse<ExpertProfile>>(`/experts/${slug}/public`);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch expert profile",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const expertsService = {
  getExpertBySlug,
};

export default expertsService;
