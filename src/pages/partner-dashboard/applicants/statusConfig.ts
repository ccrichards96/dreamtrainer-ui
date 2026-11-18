import type { OfferApplicationStatus } from "../../../types/offers";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the badge pill */
  className: string;
}

/** Partner-facing labels/colors for every stage of the application pipeline. */
export const statusConfig: Record<OfferApplicationStatus, StatusStyle> = {
  new: {
    label: "New",
    className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
  },
  reviewing: {
    label: "Reviewing",
    className: "bg-sky-100 text-sky-700 border border-sky-300",
  },
  in_review: {
    label: "In Review",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  meeting_requested: {
    label: "Meeting Requested",
    className: "bg-gray-900 text-white",
  },
  meeting_scheduled: {
    label: "Meeting Scheduled",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  meeting_completed: {
    label: "Meeting Completed",
    className: "bg-indigo-100 text-indigo-700 border border-indigo-300",
  },
  offer_made: {
    label: "Offer Made",
    className: "bg-orange-100 text-orange-700 border border-orange-300",
  },
  opportunity_archived: {
    label: "Opportunity Archived",
    className: "bg-gray-100 text-gray-600 border border-gray-300",
  },
  declined: {
    label: "Declined",
    className: "bg-red-300 text-red-900",
  },
};

/** Status options for filter dropdowns, including the "all" pseudo-status */
export const statusFilterOptions: { value: OfferApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  ...(Object.keys(statusConfig) as OfferApplicationStatus[]).map((status) => ({
    value: status,
    label: statusConfig[status].label,
  })),
];
