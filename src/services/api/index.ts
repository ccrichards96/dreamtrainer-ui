// Export the main API client
export { default as apiClient } from './client';

// Export assessment services
export * from './assessment';
export { default as assessmentService } from './assessment';

// Export types
export type { AssessmentSubmission, AssessmentResponse, ApiError } from './assessment';
