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
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { Course, Module, CourseGroup };
