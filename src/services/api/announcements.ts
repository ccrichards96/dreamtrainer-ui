import apiClient from './client';
import { Announcement, AnnouncementsResponse } from '../../types/announcements';

/**
 * Get all announcements
 * @returns Promise<Announcement[]> - List of all announcements
 */
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await apiClient.get<AnnouncementsResponse>('/announcements');
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get announcements: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching announcements');
  }
};

// Export all announcement-related functions as a service object
export const announcementService = {
  getAllAnnouncements,
};

export default announcementService;
