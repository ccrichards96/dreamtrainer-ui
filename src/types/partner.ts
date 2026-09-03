export type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
export type ListingStatus = "public" | "private";
export type PartnerCourseStatus = "draft" | "pending_review" | "published" | "archived";
export type PartnerCourseRole = "owner" | "partner";

export interface PartnerSocialLinks {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
}

export interface PartnerAssignedCourse {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  slug: string;
  status: PartnerCourseStatus;
  listingStatus: ListingStatus;
  /** This partner's role on the course */
  role: PartnerCourseRole;
  assignedAt: string;
}

export interface PartnerProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  orgName: string;
  /** The contact person's title/role at the org (e.g. "Program Director"). */
  title: string | null;
  slug: string;
  description: string | null;
  /** Individual contact bio, distinct from `description` (the org's own bio). */
  bio: string | null;
  orgBio: string | null;
  calendarLink: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: PartnerSocialLinks;
  approvalStatus: ApprovalStatus;
  listingStatus: ListingStatus;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: PartnerProfileUser | null;
  /** Always an array; empty when none assigned. Unfiltered (includes draft/archived). */
  courses: PartnerAssignedCourse[];
}

export interface PartnerPrefillData {
  firstName?: string;
  lastName?: string;
  orgName?: string;
  title?: string;
  bio?: string;
  orgBio?: string;
  websiteUrl?: string;
  calendarLink?: string;
}

export interface UpdatePartnerProfileDTO {
  orgName?: string;
  title?: string | null;
  description?: string | null;
  bio?: string | null;
  orgBio?: string | null;
  calendarLink?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: PartnerSocialLinks;
  listingStatus?: ListingStatus;
}
