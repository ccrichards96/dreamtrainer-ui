import apiClient, { APIResponse } from "./client";
import { TestAttempt } from "../../types/tests";

export interface TestAttemptData {
  firstAttempt: TestAttempt | null;
  currentAttempt: TestAttempt | null;
}

/**
 * Get all test attempts (first and current) for the authenticated user in a course
 * @param courseId - The course ID to get test attempts for
 * @returns Promise<TestAttemptData[]> - Array of test attempts data for the course
 */
export const getTestAttemptsByCourse = async (
  courseId: string,
): Promise<TestAttemptData[]> => {
  try {
    const response = await apiClient.get<APIResponse<TestAttemptData[]>>(
      `/test-attempts/course/${courseId}`,
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to get test attempts for course: ${error.message}`,
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching test attempts",
    );
  }
};

// Export all test-related functions as a service object
export const testService = {
  getTestAttemptsByCourse,
};

export default testService;
