import { Cohort, Course } from "../shared/types";
import type { CourseOffer, OfferApplicationStatus } from "../../../types/offers";

export type { Cohort, Course };

export interface Applicant {
  /** Application id — distinct from `userId` */
  id: string;
  /** Id of the user who applied */
  userId: string;
  appliedAt: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  status: OfferApplicationStatus;
  /** Assigned cohort id, or null when not yet assigned */
  cohortId: string | null;
  /** The offer this application was submitted against */
  offer?: CourseOffer;
  /** When the application was last actioned by a partner, or null if never */
  reviewedAt?: string | null;
  /** When the meeting is/was scheduled for, if one has been booked */
  meetingAt?: string | null;
  /** When the application record was last touched (status change, meeting booked, …) */
  updatedAt?: string;
}

export interface ApplicantFilterValues {
  studentName: string;
  cohortId: string;
  status: OfferApplicationStatus | "all";
}

export type ApplicantAction =
  | "view_profile"
  | "view_application"
  | "request_meeting"
  | "schedule_meeting"
  | "complete_meeting"
  | "submit_offer"
  | "move_to_not_selected";
