import { CourseOffer } from "../../types/offers";

export interface StudentOffer {
  id: string;
  title: string;
  partnerName: string;
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
  partnerName: courseOffer.partnerName ?? "",
  description: courseOffer.description,
  requirements: courseOffer.requirements ?? [],
  characteristics: courseOffer.characteristics ?? "",
  expectations: courseOffer.expectations ?? "",
  outcomes: courseOffer.outcomes ?? "",
  imageUrl: courseOffer.imageUrl,
});
