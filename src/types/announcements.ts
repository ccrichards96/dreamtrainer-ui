// Announcement related interfaces
export interface Announcement {
  id: string;
  name: string;
  message: string;
  type: "general" | "account" | "support" | "other" | "update" | "alert";
  priority: "low" | "normal" | "high" | "urgent";
  courseId?: string | null;
  expertProfileId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Draft type for creating new announcements
export type DraftAnnouncement = Pick<Announcement, "name" | "message" | "type" | "priority">;

// Update type for modifying existing announcements
export type UpdateAnnouncement = Partial<DraftAnnouncement>;

// Course-scoped announcement types
export interface CreateCourseAnnouncementPayload {
  name: string;
  message: string;
  type?: string;
  priority?: string;
}

export interface PaginatedAnnouncementsResponse {
  data: Announcement[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListCourseAnnouncementsParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}
