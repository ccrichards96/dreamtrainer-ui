import apiClient, { APIResponse } from "./client";
import { APIResponseWithPagination } from "../../types/api";
import {
  CourseAsset,
  UploadAssetParams,
  UpdateAssetParams,
  AssetPagination,
  ListAssetsParams,
} from "../../types/course-assets";

interface ListAssetsResponse {
  assets: CourseAsset[];
  pagination: AssetPagination;
}

/**
 * List assets for a course with optional filtering and pagination
 */
export const listAssets = async (
  courseId: string,
  params: ListAssetsParams = {}
): Promise<ListAssetsResponse> => {
  try {
    const response = await apiClient.get<APIResponseWithPagination<CourseAsset[]>>(
      `/courses/${courseId}/assets`,
      { params }
    );
    return {
      assets: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list assets: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while listing assets");
  }
};

/**
 * Upload an asset to a course (multipart/form-data)
 */
export const uploadAsset = async (
  courseId: string,
  params: UploadAssetParams
): Promise<CourseAsset> => {
  try {
    const formData = new FormData();
    formData.append("file", params.file);
    if (params.name) formData.append("name", params.name);
    if (params.description) formData.append("description", params.description);
    if (params.visibility) formData.append("visibility", params.visibility);
    if (params.order !== undefined) formData.append("order", String(params.order));

    const response = await apiClient.post<APIResponse<CourseAsset>>(
      `/courses/${courseId}/assets`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // 2 minutes for file uploads
      }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload asset: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while uploading asset");
  }
};

/**
 * Get a single asset by ID
 */
export const getAsset = async (courseId: string, assetId: string): Promise<CourseAsset> => {
  try {
    const response = await apiClient.get<APIResponse<CourseAsset>>(
      `/courses/${courseId}/assets/${assetId}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get asset: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching asset");
  }
};

/**
 * Get a signed download URL for an asset
 */
export const getDownloadUrl = async (
  courseId: string,
  assetId: string,
  expiresIn?: number
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  try {
    const response = await apiClient.get<
      APIResponse<{ downloadUrl: string; expiresIn: number }>
    >(`/courses/${courseId}/assets/${assetId}/download`, {
      params: expiresIn ? { expiresIn } : undefined,
    });
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get download URL: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating download URL");
  }
};

/**
 * Update an asset's metadata
 */
export const updateAsset = async (
  courseId: string,
  assetId: string,
  data: UpdateAssetParams
): Promise<CourseAsset> => {
  try {
    const response = await apiClient.put<APIResponse<CourseAsset>>(
      `/courses/${courseId}/assets/${assetId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update asset: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while updating asset");
  }
};

/**
 * Delete an asset (soft-delete + S3 removal)
 */
export const deleteAsset = async (courseId: string, assetId: string): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/assets/${assetId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while deleting asset");
  }
};

export const courseAssetsService = {
  listAssets,
  uploadAsset,
  getAsset,
  getDownloadUrl,
  updateAsset,
  deleteAsset,
};

export default courseAssetsService;
