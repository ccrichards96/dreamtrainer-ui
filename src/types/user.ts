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

export type { User };
