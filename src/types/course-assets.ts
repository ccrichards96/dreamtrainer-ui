export enum AssetType {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  AUDIO = "AUDIO",
  OTHER = "OTHER",
}

export enum AssetStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  FAILED = "FAILED",
}

export enum AssetVisibility {
  PUBLIC = "PUBLIC",
  ENROLLED_ONLY = "ENROLLED_ONLY",
  PRIVATE = "PRIVATE",
}

export interface CourseAsset {
  id: string;
  name: string;
  description: string | null;
  s3Key: string;
  mimeType: string;
  fileSize: number;
  type: AssetType;
  status: AssetStatus;
  visibility: AssetVisibility;
  thumbnailS3Key: string | null;
  courseId: string;
  uploadedById: string;
  metadata: Record<string, unknown> | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}
