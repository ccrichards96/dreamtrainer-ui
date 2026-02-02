import { Test } from "./tests";

/**
 * Course status enum
 */
export enum CourseStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

/**
 * Course listing status enum
 */
export enum ListingStatus {
  PUBLIC = "public",
  PRIVATE = "private",
}

/**
 * Expert social links - optional URLs to expert's social profiles
 */
export interface ExpertSocialLinks {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
}

/**
 * Expert profile - instructor/creator profile for courses
 */
export interface ExpertProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  slug: string;
  avatarUrl: string | null;
  expertise: Record<string, string>;
  socialLinks: ExpertSocialLinks;
  approvalStatus: "pending" | "approved" | "rejected";
  listingStatus: ListingStatus;
  stripeConnectId: string | null;
  approvedAt: string | null;
  calendarLink: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Section - Intermediate layer between Course and Module
 * New hierarchy: Course → Section → Module
 */
interface Section {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  courseId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  modules?: Module[];
}

/**
 * Course - Top level container
 * Contains Sections which contain Modules
 */
interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  slug: string;
  expertProfileId: string | null;
  expertProfile?: ExpertProfile; // Nested expert profile data
  status: CourseStatus;
  price: number;
  stripeProductId: string | null;
  listingStatus: ListingStatus;
  order: number;
  numberOfSections?: number; // Returned from /courses endpoint
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  sections?: Section[];
  tests?: Test[];
}

/**
 * Module - Learning unit within a Section
 * Now belongs to a Section instead of directly to a Course
 */
interface Module {
  id: string;
  sectionId: string; // Changed from courseId
  topic: string; // e.g., "Introduction to TOEFL Writing"
  description: string;
  status: string;
  videoUrl: string; // URL for the video content
  botIframeUrl: string; // URL for the trainer bot
  lessonContent: string; // Rich text content for the lesson
  order: number;
  createdBy: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Draft type for creating new modules (excludes auto-generated fields)
export type DraftModule = Pick<
  Module,
  | "sectionId" // Changed from courseId
  | "topic"
  | "description"
  | "status"
  | "videoUrl"
  | "botIframeUrl"
  | "lessonContent"
>;

export type UpdateModule = Partial<
  Pick<
    Module,
    | "topic"
    | "description"
    | "status"
    | "videoUrl"
    | "botIframeUrl"
    | "lessonContent"
    | "order"
    | "sectionId" // Can move module to different section
  >
>;

// Draft type for creating new sections
export type DraftSection = Pick<Section, "courseId" | "name"> & {
  description?: string;
  imageUrl?: string;
  order?: number;
};

// Update type for modifying existing sections
export type UpdateSection = Partial<Pick<Section, "name" | "description" | "imageUrl" | "order">>;

export type { Course, Module, Section };
