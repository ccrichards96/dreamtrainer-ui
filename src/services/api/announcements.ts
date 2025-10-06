import apiClient from "./client";
import { Announcement, AnnouncementsResponse } from "../../types/announcements";

/**
 * Get all announcements
 * @returns Promise<Announcement[]> - List of all announcements
 */
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response =
      await apiClient.get<AnnouncementsResponse>("/announcements");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get announcements: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching announcements",
    );
  }
};

/**
 * Create a new announcement
 * @param announcementData - The announcement data to create
 * @returns Promise<Announcement> - The created announcement
 */
export const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> => {
  try {
    const response = await apiClient.post<{ data: Announcement }>("/announcements", announcementData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create announcement: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while creating announcement");
  }
};

/**
 * Update an existing announcement
 * @param id - The announcement ID
 * @param announcementData - The updated announcement data
 * @returns Promise<Announcement> - The updated announcement
 */
export const updateAnnouncement = async (id: string, announcementData: Partial<Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Announcement> => {
  try {
    const response = await apiClient.put<{ data: Announcement }>(`/announcements/${id}`, announcementData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update announcement: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while updating announcement");
  }
};

/**
 * Delete an announcement
 * @param id - The announcement ID
 * @returns Promise<void>
 */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/announcements/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete announcement: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while deleting announcement");
  }
};

// Export all announcement-related functions as a service object
export const announcementService = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

export default announcementService;
