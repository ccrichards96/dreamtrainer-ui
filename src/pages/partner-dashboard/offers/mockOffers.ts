import { Offer, OfferFormData } from "./types";

export const mockOffers: Offer[] = [
  { id: "1", title: "Applicants - May 2026" },
  { id: "2", title: "Applicants - June 2026" },
  { id: "3", title: "Early Bird - April 2026" },
];

/** Empty form used when creating a new offer or as a fallback. */
export const emptyOfferForm: OfferFormData = {
  name: "",
  description: "",
  requirements: ["", "", ""],
  characteristics: "",
  expectations: "",
  outcomes: "",
};

/**
 * Returns the offer (card metadata) and its editable form data for a given id.
 * Placeholder data source — replace with a real API call later.
 */
export function getOfferById(id: string): { offer: Offer; form: OfferFormData } | null {
  const offer = mockOffers.find((o) => o.id === id);
  if (!offer) return null;
  return { offer, form: { ...emptyOfferForm } };
}
