
export type AttachmentOwnerType = "offer_application";

export interface Attachment {
  id: string;
  ownerType: AttachmentOwnerType;
  ownerId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

/** Response from the signed-URL endpoints — the URL is short-lived. */
export interface AttachmentDownload {
  downloadUrl: string;
  expiresIn: number;
}
