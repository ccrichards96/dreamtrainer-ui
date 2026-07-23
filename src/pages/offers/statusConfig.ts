import type { OfferApplicationStatus } from "../../types/offers";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the badge pill. */
  className: string;
}

/** Student-facing labels/colors for an application's status. */
export const applicationStatusConfig: Record<OfferApplicationStatus, StatusStyle> = {
  pending: {
    label: "Applied",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Accepted",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Not selected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};
