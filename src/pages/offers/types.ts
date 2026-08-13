import { CourseOffer } from "../../types/offers";

export interface StudentOffer {
  id: string;
  title: string;
  partnerName: string;
  partnerLogoUrl?: string;
  partnerWebsiteUrl?: string;
  description: string;
  requirements: string[];
  characteristics: string;
  expectations: string;
  outcomes: string;
  imageUrl?: string;
}

/** Narrow the full API record down to what the offer cards/modals actually render. */
export const toStudentOffer = (courseOffer: CourseOffer): StudentOffer => ({
  id: courseOffer.id,
  title: courseOffer.title,
  partnerName: courseOffer.partnerProfile?.orgName ?? courseOffer.partnerName ?? "",
  partnerLogoUrl: courseOffer.partnerProfile?.logoUrl ?? undefined,
  partnerWebsiteUrl: courseOffer.partnerProfile?.websiteUrl ?? undefined,
  description: courseOffer.description,
  requirements: courseOffer.requirements ?? [],
  characteristics: courseOffer.characteristics ?? "",
  expectations: courseOffer.expectations ?? "",
  outcomes: courseOffer.outcomes ?? "",
  imageUrl: courseOffer.imageUrl,
});
