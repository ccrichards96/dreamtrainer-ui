import { User as Auth0User } from "@auth0/auth0-react";

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
  lastLoginAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type { User };
