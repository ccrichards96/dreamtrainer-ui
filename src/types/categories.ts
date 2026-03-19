export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
