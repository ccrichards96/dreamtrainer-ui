import apiClient from './client';

// Category types based on API documentation
export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
  message: string;
}

// Categories API service
export const categoriesApi = {
  /**
   * Get all categories
   * GET /categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<CategoryListResponse>('/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  /**
   * Get a category by ID
   * GET /categories/{id}
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<CategoryResponse>(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  },

  /**
   * Create a new category
   * POST /categories
   */
  async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
    try {
      const response = await apiClient.post<CategoryResponse>('/categories', categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  /**
   * Update a category
   * PUT /categories/{id}
   */
  async updateCategory(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    try {
      const response = await apiClient.put<CategoryResponse>(`/categories/${id}`, categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  },

  /**
   * Delete a category (soft delete)
   * DELETE /categories/{id}
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
};

// Export individual functions for convenience
export const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = categoriesApi;

export default categoriesApi;
