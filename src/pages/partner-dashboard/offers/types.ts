import type { CourseOfferStatus, OfferEmailTemplate } from "../../../types/offers";

export type OfferAction = "edit" | "delete";

export interface Offer {
  id: string;
  title: string;
  status: CourseOfferStatus;
  /** Optional cover/preview image for the offer */
  imageUrl?: string;
}

/** Editable fields shown on the offer detail page. */
export interface OfferFormData {
  name: string;
  description: string;
  imageUrl: string;
  requirements: string[];
  characteristics: string[];
  expectations: string[];
  outcomes: string[];
  acceptanceEmail: OfferEmailTemplate;
  rejectionEmail: OfferEmailTemplate;
}
