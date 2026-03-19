import type { Course } from "./modules";

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

export interface CourseStudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export interface CourseStudent {
  id: string;
  courseId: string;
  userId: string;
  subscriptionId: string | null;
  dateJoined: string | null;
  createdAt: string;
  updatedAt: string;
  user: CourseStudentUser;
}

export interface ListCourseStudentsParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface PaginatedCourseStudentsResponse {
  data: CourseStudent[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
