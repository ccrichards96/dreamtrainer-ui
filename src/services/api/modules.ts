import apiClient from './client';
import type { Module } from '../../types/modules';

export interface ApiError {
  message: string;
  status?: number;
}

export interface ModulesResponse {
  success: boolean;
  data: Module[];
  message: string;
}

/**
 * Get all modules for a specific course
 * @param courseId - The ID of the course
 * @returns Promise<ModulesResponse>
 */
export const getAllModulesByCourse = async (courseId: string): Promise<ModulesResponse> => {
  try {
    const response = await apiClient.get<ModulesResponse>(`/courses/${courseId}/modules`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to fetch modules',
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get a single module by its ID
 * @param moduleId - The ID of the module
 * @returns Promise<Module>
 */
export const getModuleById = async (moduleId: string): Promise<Module> => {
  try {
    const response = await apiClient.get<Module>(`/modules/${moduleId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to fetch module',
      status: error.response?.status,
    };
    throw apiError;
  }
};

// Default export object with all module service functions
const modulesService = {
  getAllModulesByCourse,
  getModuleById,
};

export default modulesService;
