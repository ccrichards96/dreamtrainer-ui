import apiClient, { APIResponse } from "./client";
import type { User, UpdateUser, DraftSupportMessage } from "../../types/user";

/**
 * Get current user information
 * @returns Promise<User> - Current user data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<APIResponse<User>>("/users/me");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching user data");
  }
};

/**
 * Update current user information
 * @param userData - User data to update
 * @returns Promise<User> - Updated user data
 */
export const updateCurrentUser = async (userData: UpdateUser): Promise<User> => {
  try {
    const response = await apiClient.put<APIResponse<User>>("/users/me", userData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while updating user data");
  }
};

/**
 * Send support message
 * @param messageData - Support message data
 * @returns Promise<void> - Success confirmation
 */
export const sendSupportMessage = async (messageData: DraftSupportMessage): Promise<void> => {
  try {
    const response = await apiClient.post<APIResponse<void>>("/support/messages", messageData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send support message: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while sending support message");
  }
};

/**
 * Upload avatar image for current user
 * @param file - Image file to upload
 * @returns Promise<string> - New avatar URL
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<APIResponse<{ avatarUrl: string }>>(
      "/users/me/avatar",
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return response.data.data.avatarUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred while uploading avatar");
  }
};

// Export all user-related functions as a service object
export const userService = {
  getCurrentUser,
  updateCurrentUser,
  sendSupportMessage,
  uploadAvatar,
};

export default userService;
