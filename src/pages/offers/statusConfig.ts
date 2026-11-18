import type { OfferApplicationStatus } from "../../types/offers";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the badge pill. */
  className: string;
}

/** Student-facing labels/colors for an application's status. */
export const applicationStatusConfig: Record<OfferApplicationStatus, StatusStyle> = {
  new: {
    label: "Applied",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  reviewing: {
    label: "Reviewing",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  in_review: {
    label: "In review",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  meeting_requested: {
    label: "Meeting requested",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  meeting_scheduled: {
    label: "Meeting scheduled",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  meeting_completed: {
    label: "Meeting completed",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  offer_made: {
    label: "Offer made",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  opportunity_archived: {
    label: "Archived",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  declined: {
    label: "Not selected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};
