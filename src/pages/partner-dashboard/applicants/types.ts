import { Cohort, Course } from "../shared/types";

export type { Cohort, Course };

export enum ApplicantStatus {
  New = "new",
  InReview = "in_review",
  PendingMeetingResponse = "pending_meeting_response",
  MeetingScheduled = "meeting_scheduled",
  MeetingCompleted = "meeting_completed",
  PendingOfferResponse = "pending_offer_response",
  OfferAccepted = "offer_accepted",
  Declined = "declined",
}

export interface Applicant {
  id: string;
  appliedAt: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  status: ApplicantStatus;
  /** Assigned cohort id, or null when not yet assigned */
  cohortId: string | null;
}

export interface ApplicantFilterValues {
  studentName: string;
  cohortId: string;
  status: ApplicantStatus | "all";
}

export type ApplicantAction =
  | "view_profile"
  | "view_application"
  | "schedule_meeting"
  | "submit_offer"
  | "move_to_not_selected";
