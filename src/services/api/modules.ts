import apiClient, { APIResponse, ApiError } from "./client";
import type {
  Module,
  DraftModule,
  UpdateModule,
  Section,
  DraftSection,
  UpdateSection,
  Course,
} from "../../types/modules";

// ========== SECTION API FUNCTIONS ==========

/**
 * Get all sections
 * GET /sections
 * @returns Promise<Section[]>
 */
export const getAllSections = async (): Promise<Section[]> => {
  try {
    const response = await apiClient.get<APIResponse<Section[]>>(`/sections`);
    return response.data.data || [];
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch sections",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get section by ID
 * GET /sections/:id
 * @param sectionId - The ID of the section
 * @returns Promise<Section>
 */
export const getSectionById = async (sectionId: string): Promise<Section> => {
  try {
    const response = await apiClient.get<APIResponse<Section>>(`/sections/${sectionId}`);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch section",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get section with its modules
 * GET /sections/:id/modules
 * @param sectionId - The ID of the section
 * @returns Promise<Section>
 */
export const getSectionWithModules = async (sectionId: string): Promise<Section> => {
  try {
    const response = await apiClient.get<APIResponse<Section>>(`/sections/${sectionId}/modules`);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch section with modules",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get modules list for a section
 * GET /sections/:id/modules-list
 * @param sectionId - The ID of the section
 * @returns Promise<Module[]>
 */
export const getModulesBySection = async (sectionId: string): Promise<Module[]> => {
  try {
    const response = await apiClient.get<APIResponse<Module[]>>(
      `/sections/${sectionId}/modules-list`
    );
    return response.data.data || [];
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch section modules",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Create a new section
 * POST /sections
 * @param sectionData - The section data
 * @returns Promise<Section>
 */
export const createSection = async (sectionData: DraftSection): Promise<Section> => {
  try {
    const response = await apiClient.post<APIResponse<Section>>(`/sections`, sectionData);
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to create section",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Update a section
 * PUT /sections/:id
 * @param sectionId - The ID of the section
 * @param sectionData - The section data to update
 * @returns Promise<Section>
 */
export const updateSection = async (
  sectionId: string,
  sectionData: UpdateSection
): Promise<Section> => {
  try {
    const response = await apiClient.put<APIResponse<Section>>(
      `/sections/${sectionId}`,
      sectionData
    );
    return response.data.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to update section",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Delete a section
 * DELETE /sections/:id
 * Note: Cannot delete a section that has modules
 * @param sectionId - The ID of the section
 * @returns Promise<void>
 */
export const deleteSection = async (sectionId: string): Promise<void> => {
  try {
    await apiClient.delete(`/sections/${sectionId}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to delete section",
      status: error.response?.status,
    };
    throw apiError;
  }
};

// ========== COURSE API FUNCTIONS ==========

/**
 * Get all courses
 * GET /courses
 * @returns Promise<APIResponse<Course[]>>
 */
export const getAllCourses = async (): Promise<APIResponse<Course[]>> => {
  try {
    const response = await apiClient.get<APIResponse<Course[]>>(`/courses`);
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
 * Get a course by ID
 * GET /courses/:id
 * @param courseId - The ID of the course
 * @returns Promise<APIResponse<Course>>
 */
export const getCourseById = async (courseId: string): Promise<APIResponse<Course>> => {
  try {
    const response = await apiClient.get<APIResponse<Course>>(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get a course by slug
 * GET /courses/slug/:slug
 * @param slug - The slug of the course
 * @returns Promise<APIResponse<Course>>
 */
export const getCourseBySlug = async (slug: string): Promise<APIResponse<Course>> => {
  try {
    const response = await apiClient.get<APIResponse<Course>>(`/courses/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to fetch course',
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get course with full content (sections with nested modules)
 * GET /courses/:id/modules
 * @param courseId - The ID of the course
 * @returns Promise<APIResponse<Course>> - Course with sections and nested modules
 */
export const getCourseWithModulesById = async (courseId: string): Promise<APIResponse<Course>> => {
  try {
    const response = await apiClient.get<APIResponse<Course>>(`/courses/${courseId}/modules`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course with modules",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get sections for a course
 * GET /courses/:id/sections
 * @param courseId - The ID of the course
 * @returns Promise<Section[]>
 */
export const getCourseSections = async (courseId: string): Promise<Section[]> => {
  try {
    const response = await apiClient.get<APIResponse<Section[]>>(`/courses/${courseId}/sections`);
    return response.data.data || [];
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to fetch course sections",
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Get a single module by its ID
 * GET /modules/:id
 * @param moduleId - The ID of the module
 * @returns Promise<Module>
 */
export const getModuleById = async (moduleId: string): Promise<Module> => {
  try {
    const response = await apiClient.get<APIResponse<Module>>(`/modules/${moduleId}`);
    return response.data.data;
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
 * PUT /courses/:id
 * Note: Cannot delete a course that has sections
 * @param courseId - The ID of the course to update
 * @param courseData - The course data to update
 * @returns Promise<Course>
 */
export const updateCourse = async (
  courseId: string,
  courseData: { name?: string; description?: string; order?: number }
): Promise<Course> => {
  try {
    const response = await apiClient.put<APIResponse<Course>>(`/courses/${courseId}`, courseData);
    return response.data.data;
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
 * POST /courses
 * @param courseData - The course data
 * @returns Promise<Course>
 */
export const createCourse = async (courseData: {
  name: string;
  description?: string;
}): Promise<APIResponse<Course>> => {
  try {
    const response = await apiClient.post<APIResponse<Course>>(`/courses`, courseData);
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
 * POST /modules
 * @param moduleData - The module data
 * @returns Promise<Module>
 */
export const createModule = async (moduleData: DraftModule): Promise<Module> => {
  try {
    const response = await apiClient.post<APIResponse<Module>>(`/modules`, moduleData);
    return response.data.data;
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
 * PUT /modules/:id
 * @param moduleId - The ID of the module to update
 * @param moduleData - The module data to update
 * @returns Promise<Module>
 */
export const updateModule = async (moduleId: string, moduleData: UpdateModule): Promise<Module> => {
  try {
    const response = await apiClient.put<APIResponse<Module>>(`/modules/${moduleId}`, moduleData);
    return response.data.data;
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
 * DELETE /modules/:id
 * @param moduleId - The ID of the module to delete
 * @returns Promise<void>
 */
export const deleteModule = async (moduleId: string): Promise<void> => {
  try {
    await apiClient.delete(`/modules/${moduleId}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || "Failed to delete module",
      status: error.response?.status,
    };
    throw apiError;
  }
};

// Default export object with key service functions
const modulesService = {
  getModuleById,
  getSectionWithModules,
  getModulesBySection,
};

export default modulesService;
