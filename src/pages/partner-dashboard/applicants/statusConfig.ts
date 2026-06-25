import { ApplicantStatus } from "./types";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the badge pill */
  className: string;
}

export const statusConfig: Record<ApplicantStatus, StatusStyle> = {
  [ApplicantStatus.New]: {
    label: "New",
    className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
  },
  [ApplicantStatus.InReview]: {
    label: "In Review",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  [ApplicantStatus.PendingMeetingResponse]: {
    label: "Pending Meeting Response",
    className: "bg-gray-900 text-white",
  },
  [ApplicantStatus.MeetingScheduled]: {
    label: "Meeting Scheduled",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  [ApplicantStatus.MeetingCompleted]: {
    label: "Meeting Completed",
    className: "bg-indigo-100 text-indigo-700 border border-indigo-300",
  },
  [ApplicantStatus.PendingOfferResponse]: {
    label: "Pending Offer Response",
    className: "bg-orange-100 text-orange-700 border border-orange-300",
  },
  [ApplicantStatus.OfferAccepted]: {
    label: "Offer Accepted",
    className: "bg-green-100 text-green-700 border border-green-300",
  },
  [ApplicantStatus.Declined]: {
    label: "Declined",
    className: "bg-red-300 text-red-900",
  },
};

/** Status options for filter dropdowns, including the "all" pseudo-status */
export const statusFilterOptions: { value: ApplicantStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  ...Object.values(ApplicantStatus).map((status) => ({
    value: status,
    label: statusConfig[status].label,
  })),
];
