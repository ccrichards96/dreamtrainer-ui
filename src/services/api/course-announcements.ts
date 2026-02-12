import apiClient from "./client";
import {
  Announcement,
  CreateCourseAnnouncementPayload,
  ListCourseAnnouncementsParams,
  PaginatedAnnouncementsResponse,
} from "../../types/announcements";

export const createCourseAnnouncement = async (
  courseId: string,
  payload: CreateCourseAnnouncementPayload
): Promise<Announcement> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: Announcement }>(
      `/courses/${courseId}/announcements`,
      payload
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create course announcement: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while creating course announcement");
  }
};

export const listCourseAnnouncements = async (
  courseId: string,
  params?: ListCourseAnnouncementsParams
): Promise<PaginatedAnnouncementsResponse> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: Announcement[];
      meta: { page: number; limit: number; total: number; totalPages: number };
    }>(`/courses/${courseId}/announcements`, { params });
    return { data: response.data.data, meta: response.data.meta };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list course announcements: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching course announcements");
  }
};

export const courseAnnouncementService = {
  createCourseAnnouncement,
  listCourseAnnouncements,
};

export default courseAnnouncementService;
