import apiClient, { APIResponse } from "./client";
import { User, AdminCreateUser } from "../../types/user";

/**
 * Get all users (admin)
 * @returns Promise<User[]> - List of all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<APIResponse<User[]>>("/admin/users");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching users");
  }
};

/**
 * Create a new user (admin)
 * @param userData - The user data to create
 * @returns Promise<User> - The created user
 */
export const createAdminUser = async (userData: AdminCreateUser): Promise<User> => {
  try {
    const response = await apiClient.post<APIResponse<User>>("/admin/users", userData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while creating user");
  }
};

export const adminService = {
  getAllUsers,
  createAdminUser,
};

export default adminService;
