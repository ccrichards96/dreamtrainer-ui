// Export the main API client
export { default as apiClient } from './client';

// Export announcement services
export * from './announcements';
export { default as announcementService } from './announcements';

// Export assessment services
export * from './assessment';
export { default as assessmentService } from './assessment';

// Export billing services
export * from './billing';
export { default as billingService } from './billing';

// Export categories services
export * from './categories';
export { default as categoriesService } from './categories';

// Export modules services
export * from './modules';
export { default as modulesService } from './modules';

// Export types
// export type { Announcement, AnnouncementsResponse } from './announcements';
export type { AssessmentSubmission, AssessmentResponse, ApiError } from './assessment';
export type { UserBillingInfo } from './billing';
export type { Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryResponse, CategoryListResponse } from './categories';
export type { ModulesResponse } from './modules';
