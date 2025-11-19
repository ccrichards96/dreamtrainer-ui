import apiClient, { APIResponse, ApiError } from "./client";
import type { Module, DraftModule, UpdateModule } from "../../types/modules";

/**
 * Get all courses
 * @returns Promise<any>
 */
export const getAllCoursesGroups = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/courses/groups`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course groups",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all courses
 * @returns Promise<any>
 */
export const getAllCourses = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/courses`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch courses",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all modules for a specific course
 * @param courseId - The ID of the course
 * @returns Promise<any>
 */
export const getCourseById = async (courseId: string): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch modules",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all modules for a specific course
 * @param courseId - The ID of the course
 * @returns Promise<any>
 */
export const getCourseWithModulesById = async (
  courseId: string,
): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/courses/${courseId}/modules`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch modules",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get all modules for a specific course
 * @param courseId - The ID of the course
 * @returns Promise<Module[]>
 */
export const getAllModulesByCourse = async (
  courseId: string,
): Promise<Module[]> => {
  try {
    const response = await apiClient.get<APIResponse<Module[]>>(
      `/courses/${courseId}/modules-list`,
    );
    return response.data.data;
  } catch (error: unknown) {
    const apiError: ApiError = {
      message:
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to fetch modules",
      status: (error as { response?: { status?: number } })?.response?.status,
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
      message: error.response?.data?.message || "Failed to fetch module",
      status: error.response?.status,
    };
    throw apiError;
  }
};

// ========== ADMIN API FUNCTIONS ==========

/**
 * Update a course
 * @param courseId - The ID of the course to update
 * @param courseData - The course data to update
 * @returns Promise<any>
 */
export const updateCourse = async (
  courseId: string,
  courseData: { name: string; description?: string },
): Promise<any> => {
  try {
    const response = await apiClient.put<any>(
      `/courses/${courseId}`,
      courseData,
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update course",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Create a new course
 * @param courseData - The course data
 * @returns Promise<any>
 */
export const createCourse = async (courseData: {
  name: string;
  description?: string;
}): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/courses`, courseData);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to create course",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Delete a course
 * @param courseId - The ID of the course to delete
 * @returns Promise<any>
 */
export const deleteCourse = async (courseId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<any>(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to delete course",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Create a new module
 * @param moduleData - The module data
 * @returns Promise<any>
 */
export const createModule = async (moduleData: DraftModule): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/modules`, moduleData);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to create module",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Update a module
 * @param moduleId - The ID of the module to update
 * @param moduleData - The module data to update
 * @returns Promise<any>
 */
export const updateModule = async (
  moduleId: string,
  moduleData: UpdateModule,
): Promise<any> => {
  try {
    const response = await apiClient.put<any>(
      `/modules/${moduleId}`,
      moduleData,
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update module",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Delete a module
 * @param moduleId - The ID of the module to delete
 * @returns Promise<any>
 */
export const deleteModule = async (moduleId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<any>(`/modules/${moduleId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to delete module",
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
