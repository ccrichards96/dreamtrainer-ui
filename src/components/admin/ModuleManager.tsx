import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Course, Module } from "../../types/modules";
import {
  createModule,
  updateModule,
  deleteModule,
} from "../../services/api/modules";
import { Category, getAllCategories } from "../../services/api/categories";

interface ModuleManagerProps {
  course: Course;
  modules: Module[];
}

interface ModuleFormData {
  topic: string;
  description: string;
  videoUrl: string;
  botIframeUrl: string;
  lessonContent: string;
  categoryId: string;
}

const ModuleManager: React.FC<ModuleManagerProps> = ({ course, modules }) => {
  const [moduleList, setModuleList] = useState<Module[]>(modules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [formData, setFormData] = useState<ModuleFormData>({
    topic: "",
    description: "",
    videoUrl: "",
    botIframeUrl: "",
    lessonContent: "",
    categoryId: "",
  });

  const resetForm = () => {
    setFormData({
      topic: "",
      description: "",
      videoUrl: "",
      botIframeUrl: "",
      lessonContent: "",
      categoryId: "",
    });
  };

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      lessonContent: content,
    }));
  };

  const handleAddModule = () => {
    setShowAddForm(true);
    setEditingModule(null);
    resetForm();
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowAddForm(true);
    setFormData({
      topic: module.topic,
      description: module.description,
      videoUrl: module.videoUrl,
      botIframeUrl: module.botIframeUrl,
      lessonContent: module.lessonContent,
      categoryId: module.categoryId || "",
    });
  };

  const handleSubmitModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingModule) {
        // Update existing module via API
        await updateModule(editingModule.id, formData);

        // Update local state
        setModuleList((prev) =>
          prev.map((module) =>
            module.id === editingModule.id
              ? { ...module, ...formData, updatedAt: new Date() }
              : module,
          ),
        );
      } else {
        // Create new module via API
        const moduleData = {
          courseId: course.id,
          topic: formData.topic,
          description: formData.description,
          status: "active",
          videoUrl: formData.videoUrl,
          botIframeUrl: formData.botIframeUrl,
          lessonContent: formData.lessonContent,
          categoryId: formData.categoryId,
        };
        const response = await createModule(moduleData);
        const newModule = response.data;

        // Add to local state
        setModuleList((prev) => [...prev, newModule]);
      }

      setShowAddForm(false);
      setEditingModule(null);
      resetForm();
    } catch (err) {
      setError("Failed to save module. Please try again.");
      console.error("Error saving module:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      // Delete module via API
      await deleteModule(moduleId);

      // Remove from local state
      setModuleList((prev) => prev.filter((module) => module.id !== moduleId));
    } catch (err) {
      setError("Failed to delete module. Please try again.");
      console.error("Error deleting module:", err);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingModule(null);
    resetForm();
  };

  const isFormValid =
    formData.topic.trim().length > 0 && formData.description.trim().length > 0;

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
              <h3 className="text-lg font-medium text-gray-900">
                Manage Modules
              </h3>
              <p className="text-sm text-gray-500">Course: {course.name}</p>
            </div>
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Module
            </button>
          </div>
        </div>

        {/* Course Info */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{course.name}</p>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Add/Edit Module Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                {editingModule ? "Edit Module" : "Add New Module"}
              </h4>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitModule} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module Topic */}
              <div className="md:col-span-2">
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Module Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., TOEFL Writing Task 1"
                />
              </div>

              {/* Module Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what students will learn in this module"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading categories...
                  </p>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vimeo Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Bot iFrame URL */}
              <div>
                <label
                  htmlFor="botIframeUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                 VectorShift Bot iFrame URL
                </label>
                <input
                  type="url"
                  id="botIframeUrl"
                  name="botIframeUrl"
                  value={formData.botIframeUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Lesson Content */}
              <div className="md:col-span-2">
                <label
                  htmlFor="lessonContent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lesson Content
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.lessonContent}
                    onChange={handleQuillChange}
                    placeholder="Enter the lesson content..."
                    style={{
                      minHeight: "150px",
                      backgroundColor: "white",
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "list",
                      "bullet",
                      "color",
                      "background",
                      "link",
                      "image",
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
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
                    {editingModule ? "Update Module" : "Add Module"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Modules List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Modules ({moduleList.length})
          </h4>
        </div>

        {moduleList.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No modules found. Add your first module to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {moduleList.map((module, index) => (
              <div key={module.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <h5 className="text-lg font-medium text-gray-900">
                        {module.topic}
                      </h5>
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditModule(module)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModuleManager;
