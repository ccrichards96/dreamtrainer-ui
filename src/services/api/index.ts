// Export the main API client
export { default as apiClient } from './client';

// Export assessment services
export * from './assessment';
export { default as assessmentService } from './assessment';

// Export billing services
export * from './billing';
export { default as billingService } from './billing';

// Export modules services
export * from './modules';
export { default as modulesService } from './modules';

// Export types
export type { AssessmentSubmission, AssessmentResponse, ApiError } from './assessment';
export type { UserBillingInfo } from './billing';
export type { ModulesResponse } from './modules';
