export type CourseOfferStatus = "draft" | "active" | "archived";

/** A student's application lifecycle for a given offer. */
export type OfferApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface CourseOffer {
  id: string;
  courseId?: string;
  title: string;
  partnerName?: string;
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
