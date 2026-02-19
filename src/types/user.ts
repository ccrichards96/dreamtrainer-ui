import { User as Auth0User } from "@auth0/auth0-react";
import { ExpertProfile, ExpertSocialLinks } from "./modules";

export enum Role {
  Admin = "admin",
  User = "user",
}

interface User {
  id: string;
  authUser?: Auth0User;
  auth0Id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
  avatarUrl: string | null;
  role: Role;
  expertProfile: ExpertProfile | null;
  lastLoginAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Update type for modifying user information
export type UpdateUser = Partial<
  Pick<User, "firstName" | "lastName" | "email" | "onboardingComplete">
> & {
  howDidYouHearAboutUs?: string;
  englishProficiency?: string;
};

// Draft type for creating support messages
export type DraftSupportMessage = {
  message: string;
  supportType: "technical" | "course-content" | "billing" | "general" | "feedback";
  userId: string;
  email: string;
};

export type AdminCreateExpertProfileDTO = {
  displayName: string;
  bio?: string;
  expertise?: string[];
  calendarLink?: string;
};

export type AdminCreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  userType: "student" | "expert";
  createAsExpert?: boolean;
  expertProfile?: AdminCreateExpertProfileDTO;
};

export type AdminUpdateExpertProfile = {
  displayName?: string;
  bio?: string | null;
  expertise?: string[];
  calendarLink?: string | null;
  approvalStatus?: "pending" | "approved" | "rejected";
  listingStatus?: "public" | "private";
  socialLinks?: ExpertSocialLinks;
};

export type AdminUpdateUser = Partial<
  Pick<User, "firstName" | "lastName" | "email" | "role" | "onboardingComplete" | "isEmailVerified">
> & {
  expertProfile?: AdminUpdateExpertProfile;
};

export type { User };
