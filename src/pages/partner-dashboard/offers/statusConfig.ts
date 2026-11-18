import type { CourseOfferStatus } from "../../../types/offers";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the badge pill. */
  className: string;
}

/** Partner-facing labels/colors for an offer's publication status. */
export const offerStatusConfig: Record<CourseOfferStatus, StatusStyle> = {
  draft: {
    label: "Draft",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  active: {
    label: "Published",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  archived: {
    label: "Archived",
    className: "border-gray-200 bg-gray-100 text-gray-600",
  },
};
