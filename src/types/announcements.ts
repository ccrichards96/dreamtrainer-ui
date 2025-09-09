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

export interface AnnouncementsResponse {
  success: boolean;
  data: Announcement[];
  message: string;
}
