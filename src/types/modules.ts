import { Test } from "./tests";

interface CourseGroup {
  id: string;
  name: string; //TOEFL Writing Max Course
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Course {
  id: string;
  name: string; //TOEFL Writing Max Course
  description?: string;
  courseGroupId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  modules?: Module[];
  tests?: Test[];
  courseGroup?: CourseGroup;
}

interface Module {
  id: string;
  courseId: string;
  categoryId: string | null;
  topic: string; // e.g., "Introduction to TOEFL Writing"
  description: string;
  status: string;
  videoUrl: string; // URL for the video content
  botIframeUrl: string; // URL for the trainer bot
  lessonContent: string; //Rich text content for the lesson
  order: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Draft type for creating new modules (excludes auto-generated fields)
export type DraftModule = Pick<
  Module,
  | "courseId"
  | "categoryId"
  | "topic"
  | "description"
  | "status"
  | "videoUrl"
  | "botIframeUrl"
  | "lessonContent"
>;

// Update type for modifying existing modules (partial of editable fields)
export type UpdateModule = Partial<
  Pick<
    Module,
    | "categoryId"
    | "topic"
    | "description"
    | "status"
    | "videoUrl"
    | "botIframeUrl"
    | "lessonContent"
    | "order"
  >
>;

export type { Course, Module, CourseGroup };
