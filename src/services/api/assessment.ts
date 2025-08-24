import { TestAttempt, DraftTestAttempt } from '../../types/tests';
import apiClient, {APIResponse} from './client';

export interface AssessmentSubmission {
  first_name: string;
  last_name: string;
  email: string;
  test_number: string;
  homework_completed: string;
  followed_toefl_timing: string;
  essay_question_1: string;
  essay_question_1_word_count: string;
  essay_question_2: string;
  essay_question_2_word_count: string;
}

export interface AssessmentResponse {
  id: string;
  status: 'submitted' | 'processing' | 'completed';
  message: string;
  submittedAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Submit an assessment for evaluation
 * @param assessmentData - The assessment form data
 * @returns Promise<AssessmentResponse> - The submission response
 */
export const submitAssessment = async (testId:string, userId:string, assessmentData: AssessmentSubmission): Promise<AssessmentResponse> => {
  try {
    // Prepare data as x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('first_name', assessmentData.first_name || '');
    params.append('last_name', assessmentData.last_name || '');
    params.append('email', assessmentData.email || '');
    params.append('test_number', assessmentData.test_number || '');
    params.append('homework_completed', assessmentData.homework_completed || '');
    params.append('followed_toefl_timing', assessmentData.followed_toefl_timing || '');
    params.append('essay_question_1', assessmentData.essay_question_1 || '');
    params.append('essay_question_1_word_count', assessmentData.essay_question_1_word_count || '');
    params.append('essay_question_2', assessmentData.essay_question_2 || '');
    params.append('essay_question_2_word_count', assessmentData.essay_question_2_word_count || '');

    const draftTestAttempt: DraftTestAttempt = {
      testId: testId,
      userId: userId,
      answerContent: params.toString(),
    };

    const testAttemptResponse = await apiClient.post<APIResponse<TestAttempt>>('/test-attempts', draftTestAttempt);

    params.append('testAttemptId', testAttemptResponse.data.data?.id || '');

    // Submit to external webhook
    const response = await fetch('http://18.118.77.149:5678/webhook/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    // Send to test scorer webhook
    await fetch('http://18.118.77.149:5678/webhook/test-scorer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse response - assuming webhook returns JSON
    const responseData = await response.json();
    
    // Return formatted response to match our interface
    return {
      id: responseData.id || Date.now().toString(),
      status: 'submitted' as const,
      message: responseData.message || 'Assessment submitted successfully',
      submittedAt: new Date().toISOString()
    };
  } catch (error) {
    // Handle and format error response
    if (error instanceof Error) {
      throw new Error(`Failed to submit assessment: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while submitting the assessment');
  }
};

/**
 * Get all assessments for the current user
 * @returns Promise<AssessmentResponse[]> - List of user assessments
 */
export const getUserAssessments = async (): Promise<AssessmentResponse[]> => {
  try {
    const response = await apiClient.get<AssessmentResponse[]>('/assessments');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user assessments: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching assessments');
  }
};

// Export all assessment-related functions as a service object
export const assessmentService = {
  submitAssessment,
  getUserAssessments,
};

export default assessmentService;
