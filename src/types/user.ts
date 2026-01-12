import { User as Auth0User } from "@auth0/auth0-react";

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

export type { User };
