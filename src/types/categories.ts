export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Draft type for creating new categories
export type DraftCategory = Pick<Category, "name">;

// Update type for modifying existing categories
export type UpdateCategory = Partial<DraftCategory>;
