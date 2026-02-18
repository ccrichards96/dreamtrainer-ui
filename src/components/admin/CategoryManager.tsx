import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertCircle,
  Tag,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Category } from "../../types/categories";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api/categories";

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", imageUrl: "" });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getAllCategories();
        setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder));
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    setShowAddForm(true);
    setEditingCategory(null);
    resetForm();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowAddForm(true);
    setFormData({
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
      } else {
        const created = await createCategory({
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          sortOrder: categories.length,
        });
        setCategories((prev) => [...prev, created]);
      }

      setShowAddForm(false);
      setEditingCategory(null);
      resetForm();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to save category.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!confirm(`Are you sure you want to delete "${category?.name}"?`)) return;

    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete category.");
      }
    }
  };

  const handleMove = async (categoryId: string, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === categoryId);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === categories.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newList = [...categories];
    [newList[currentIndex], newList[newIndex]] = [newList[newIndex], newList[currentIndex]];
    newList.forEach((cat, index) => {
      cat.sortOrder = index;
    });

    setCategories(newList);
    setReorderingId(categoryId);

    try {
      await Promise.all([
        updateCategory(newList[currentIndex].id, { sortOrder: newList[currentIndex].sortOrder }),
        updateCategory(newList[newIndex].id, { sortOrder: newList[newIndex].sortOrder }),
      ]);
    } catch (err) {
      setError("Failed to reorder categories. Please refresh the page.");
      const data = await getAllCategories();
      setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } finally {
      setReorderingId(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    resetForm();
  };

  const isFormValid = formData.name.trim().length > 0;

  if (loadingCategories) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-500">Create and manage course categories</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{categories.length} category(ies)</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h4>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Test Preparation"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe this category"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingCategory ? "Update Category" : "Create Category"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No categories yet. Create your first category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Reorder Controls */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleMove(category.id, "up")}
                      disabled={index === 0 || reorderingId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(category.id, "down")}
                      disabled={index === categories.length - 1 || reorderingId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm font-medium text-gray-900 truncate">{category.name}</h4>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Order: {category.sortOrder} | ID: {category.id.slice(0, 8)}...
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      disabled={reorderingId !== null}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1 disabled:opacity-50 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={reorderingId !== null}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryManager;
