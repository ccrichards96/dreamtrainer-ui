import apiClient, { APIResponse, ApiError } from "./client";
import type { ExpertProfile } from "../../types/modules";
import { ExpertPerformanceData } from "../../types/expert";
import type { UpdateExpertProfileDTO, AdminCreateExpertProfileDTO } from "../../types/user";

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

export const getExpertPerformance = async (): Promise<ExpertPerformanceData | ApiError> => {
  try {
    const response =
      await apiClient.get<APIResponse<ExpertPerformanceData>>(`/experts/me/performance`);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch expert performance",
      status: error.response?.status,
    };
    throw apiError;
  }
};

export const updateMyExpertProfile = async (
  data: UpdateExpertProfileDTO
): Promise<ExpertProfile> => {
  try {
    const response = await apiClient.put<APIResponse<ExpertProfile>>(`/experts/me`, data);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update expert profile",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * POST /experts
 * Admin creates expert profile for a user
 */
export const createExpertProfile = async (
  userId: string,
  data: AdminCreateExpertProfileDTO
): Promise<ExpertProfile> => {
  try {
    const response = await apiClient.post<APIResponse<ExpertProfile>>(`/experts`, {
      userId,
      ...data,
    });
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to create expert profile",
      status: error.response?.status,
    };
    throw apiError;
  }
};

const expertsService = {
  getExpertBySlug,
  getExpertPerformance,
  updateMyExpertProfile,
  createExpertProfile,
};

export default expertsService;

