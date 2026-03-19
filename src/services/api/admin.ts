import apiClient, { APIResponse } from "./client";
import { APIResponseWithPagination } from "../../types/api";
import { User, AdminCreateUser, AdminUpdateUser } from "../../types/user";

export interface PaginatedUsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Get all users (admin) - legacy non-paginated
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
 * Get users with pagination (admin)
 */
export const getUsersPaginated = async (
  params: GetUsersParams = {}
): Promise<PaginatedUsersResponse> => {
  try {
    const response = await apiClient.get<APIResponseWithPagination<User[]>>("/admin/users", {
      params,
    });
    return {
      users: response.data.data,
      pagination: response.data.pagination,
    };
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
    const { userType, ...rest } = userData;
    const payload = {
      ...rest,
      createAsExpert: userType === "expert" ? true : undefined,
      expertProfile: userType === "expert" ? userData.expertProfile : undefined,
    };
    const response = await apiClient.post<APIResponse<User>>("/admin/users", payload);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while creating user");
  }
};

/**
 * Update a user (admin)
 */
export const updateAdminUser = async (userId: string, userData: AdminUpdateUser): Promise<User> => {
  try {
    const response = await apiClient.put<APIResponse<User>>(`/admin/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while updating user");
  }
};

/**
 * Delete a user (admin)
 */
export const deleteAdminUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while deleting user");
  }
};

export const adminService = {
  getAllUsers,
  getUsersPaginated,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};

export default adminService;
