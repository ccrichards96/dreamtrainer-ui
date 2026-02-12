export type AssetType = "document" | "image" | "video" | "audio" | "spreadsheet" | "presentation" | "other";

export type AssetStatus = "pending" | "processing" | "ready" | "failed";

export type AssetVisibility = "public" | "enrolled_only" | "private";

export interface CourseAsset {
  id: string;
  courseId: string;
  uploadedById: string;
  name: string;
  description: string | null;
  s3Key: string;
  mimeType: string;
  fileSize: number;
  type: AssetType;
  status: AssetStatus;
  visibility: AssetVisibility;
  order: number;
  metadata: Record<string, unknown> | null;
  thumbnailS3Key: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadAssetParams {
  file: File;
  name?: string;
  description?: string;
  visibility?: AssetVisibility;
  order?: number;
}

export interface UpdateAssetParams {
  name?: string;
  description?: string;
  visibility?: AssetVisibility;
  status?: AssetStatus;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface AssetPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListAssetsParams {
  page?: number;
  limit?: number;
  type?: AssetType;
  status?: AssetStatus;
  visibility?: AssetVisibility;
}
