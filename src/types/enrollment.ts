import type { Course } from './modules';

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  subscriptionId: string | null;
  dateJoined: string;
  course?: Course; // Nested course data from API
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
