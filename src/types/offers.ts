import type { Attachment } from "./attachments";

export type CourseOfferStatus = "draft" | "active" | "archived";

export interface OfferPartnerProfile {
  id: string;
  orgName: string;
  title: string | null;
  slug: string;
  orgBio: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
}

/**
 * A student's application lifecycle for a given offer.
 */
export type OfferApplicationStatus =
  | "new" // opportunity available, not yet reviewed by the applicant
  | "reviewing" // applicant is looking at the opportunity
  | "in_review" // partner is looking at the submitted application
  | "meeting_requested" // partner requested a meeting
  | "meeting_scheduled" // applicant accepted and picked a time
  | "meeting_completed" // the meeting date has passed
  | "offer_made" // partner has made a formal offer
  | "opportunity_archived" // applicant is not interested
  | "declined"; // applicant has been rejected by the partner

export interface CourseOffer {
  id: string;
  courseId?: string;
  title: string;
  partnerProfile?: OfferPartnerProfile | null;
  description: string;
  status: CourseOfferStatus;
  requirements?: string[];
  characteristics?: string;
  expectations?: string;
  outcomes?: string;
  imageUrl?: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseOfferData {
  title: string;
  description?: string;
  imageUrl?: string | null;
  status?: string;
  requirements?: string[];
  characteristics?: string;
  expectations?: string;
  outcomes?: string;
  expiresAt?: Date | null;
}

export interface UpdateCourseOfferData extends Partial<CreateCourseOfferData> {}

/** The record returned by the apply/withdraw endpoints. */
export interface OfferApplication {
  id: string;
  courseOfferId: string;
  userId: string;
  status: OfferApplicationStatus;
  appliedAt: string;
  reviewedAt: string | null;
  /** When the meeting is/was scheduled for, if one has been booked. */
  meetingAt: string | null;
  /**
   * Supporting documents submitted with the application. Only returned by the
   * apply endpoint; elsewhere fetch them on demand (see `getApplicantDocuments`).
   */
  documents?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface MyOfferApplication extends OfferApplication {
  courseOffer: CourseOffer;
}

export interface OfferApplicantUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface CourseApplicant extends OfferApplication {
  courseOffer: CourseOffer;
  user: OfferApplicantUser;
}

export interface ListOffersParams {
  search?: string;
  tag?: string;
  status?: CourseOfferStatus;
  page?: number;
  limit?: number;
}
