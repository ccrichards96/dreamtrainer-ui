export type OfferAction = "edit" | "duplicate" | "delete";

export interface Offer {
  id: string;
  title: string;
  /** Optional cover/preview image for the offer */
  imageUrl?: string;
}

/** Editable fields shown on the offer detail page. */
export interface OfferFormData {
  name: string;
  description: string;
  imageUrl: string;
  requirements: string[];
  /** Stored on the API as a single comma-separated string; edited as a list. */
  characteristics: string[];
  expectations: string[];
  outcomes: string[];
}
