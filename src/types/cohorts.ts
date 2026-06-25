import { Course } from "./modules";
import { User } from "./user";

export type CohortStatus = "active" | "archived";
export type CohortMemberStatus = "pending" | "active" | "removed";

export interface Cohort {
  id: string;
  name: string;
  description: string | null;
  status: CohortStatus;
  courseId: string;
  createdBy: string;
  course?: Course;
  user?: User;
  members?: CohortMember[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CohortMember {
  id: string;
  cohortId: string;
  userId: string;
  status: CohortMemberStatus;
  addedAt: string | null;
  removedAt: string | null;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// ----- Request payloads (DTOs) -----

export interface CreateCohortDTO {
  name: string;
  courseId: string;
  description?: string | null;
  status?: CohortStatus;
}

export interface UpdateCohortDTO {
  name?: string;
  description?: string | null;
  status?: CohortStatus;
}

export interface UpdateCohortMemberStatusDTO {
  status: CohortMemberStatus;
}
