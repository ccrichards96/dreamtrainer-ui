// Announcement related interfaces
export interface Announcement {
  id: string;
  name: string;
  message: string;
  type: "general" | "account" | "support" | "other";
  priority: "low" | "normal" | "high";
  createdAt: string;
  updatedAt: string;
}

// Draft type for creating new announcements
export type DraftAnnouncement = Pick<Announcement, "name" | "message" | "type" | "priority">;

// Update type for modifying existing announcements
export type UpdateAnnouncement = Partial<DraftAnnouncement>;
