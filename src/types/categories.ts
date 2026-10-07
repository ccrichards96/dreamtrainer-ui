import type { Course } from "./modules";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  courses?: Course[];
}

// Draft type for creating new categories
export type DraftCategory = Pick<Category, "name"> & {
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
};

// Update type for modifying existing categories
export type UpdateCategory = Partial<
  Pick<Category, "name" | "description" | "imageUrl" | "sortOrder">
>;

// A course assigned to a category (admin view), as returned by
// GET /categories/:id/courses/admin — the courseCategories join row with the full course nested
export interface CategoryCourse {
  id: string;
  categoryId: string;
  courseId: string;
  order: number;
  course: {
    id: string;
    name: string;
    imageUrl: string | null;
    status: string;
    listingStatus: string;
  };
}
