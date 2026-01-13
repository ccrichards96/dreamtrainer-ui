import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  AlertCircle,
  Layers,
  ChevronUp,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { Course, Section, Module } from "../../types/modules";
import {
  getCourseSections,
  createSection,
  updateSection,
  deleteSection,
  getSectionWithModules,
} from "../../services/api/modules";

interface SectionManagerProps {
  course: Course;
  onManageModules: (section: Section, modules: Module[]) => void;
}

interface SectionFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const SectionManager: React.FC<SectionManagerProps> = ({ course, onManageModules }) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSections, setLoadingSections] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reorderingSectionId, setReorderingSectionId] = useState<string | null>(null);
  const [loadingModulesForSection, setLoadingModulesForSection] = useState<string | null>(null);

  const [formData, setFormData] = useState<SectionFormData>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
    });
  };

  // Load sections on component mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoadingSections(true);
        const sections = await getCourseSections(course.id);
        const sortedSections = sections.sort((a, b) => a.order - b.order);
        setSectionList(sortedSections);
      } catch (err) {
        console.error("Error fetching sections:", err);
        setError("Failed to load sections");
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [course.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSection = () => {
    setShowAddForm(true);
    setEditingSection(null);
    resetForm();
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowAddForm(true);
    setFormData({
      name: section.name,
      description: section.description || "",
      imageUrl: section.imageUrl || "",
    });
  };

  const handleSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingSection) {
        // Update existing section via API
        const updatedSection = await updateSection(editingSection.id, {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
        });

        // Update local state
        setSectionList((prev) =>
          prev.map((section) =>
            section.id === editingSection.id ? updatedSection : section
          )
        );
      } else {
        // Create new section via API
        const newSection = await createSection({
          courseId: course.id,
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          order: sectionList.length, // Add at end
        });

        // Add to local state
        setSectionList((prev) => [...prev, newSection]);
      }

      setShowAddForm(false);
      setEditingSection(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save section. Please try again.");
      console.error("Error saving section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const section = sectionList.find((s) => s.id === sectionId);
    if (!confirm(`Are you sure you want to delete "${section?.name}"? This section must have no modules.`)) return;

    try {
      await deleteSection(sectionId);
      setSectionList((prev) => prev.filter((section) => section.id !== sectionId));
    } catch (err: any) {
      setError(err.message || "Failed to delete section. Make sure it has no modules.");
      console.error("Error deleting section:", err);
    }
  };

  const handleMoveSection = async (sectionId: string, direction: "up" | "down") => {
    const currentIndex = sectionList.findIndex((s) => s.id === sectionId);
    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === sectionList.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newList = [...sectionList];

    // Swap positions
    [newList[currentIndex], newList[newIndex]] = [newList[newIndex], newList[currentIndex]];

    // Update order values
    newList.forEach((section, index) => {
      section.order = index;
    });

    // Optimistically update UI
    setSectionList(newList);
    setReorderingSectionId(sectionId);

    try {
      // Update both sections' order on backend
      await Promise.all([
        updateSection(newList[currentIndex].id, { order: newList[currentIndex].order }),
        updateSection(newList[newIndex].id, { order: newList[newIndex].order }),
      ]);
    } catch (err) {
      setError("Failed to reorder sections. Please refresh the page.");
      console.error("Error reordering sections:", err);
      // Revert on error - refetch sections
      const sections = await getCourseSections(course.id);
      setSectionList(sections.sort((a, b) => a.order - b.order));
    } finally {
      setReorderingSectionId(null);
    }
  };

  const handleManageModules = async (section: Section) => {
    try {
      setLoadingModulesForSection(section.id);
      const sectionWithModules = await getSectionWithModules(section.id);
      onManageModules(section, sectionWithModules.modules || []);
    } catch (err) {
      setError("Failed to load section modules");
      console.error("Error fetching section modules:", err);
    } finally {
      setLoadingModulesForSection(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSection(null);
    resetForm();
  };

  const isFormValid = formData.name.trim().length > 0;

  if (loadingSections) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sections...</p>
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
              <h3 className="text-lg font-medium text-gray-900">Manage Sections</h3>
            </div>
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Course Info */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{course.name}</p>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">
              {sectionList.length} section(s)
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Section Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                {editingSection ? "Edit Section" : "Add New Section"}
              </h4>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitSection} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Getting Started"
                />
              </div>

              {/* Section Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what this section covers"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

            {/* Form Actions */}
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
                    {editingSection ? "Update Section" : "Create Section"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sectionList.length === 0 ? (
          <div className="p-8 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sections yet. Create your first section to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sectionList.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Reorder Controls */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleMoveSection(section.id, "up")}
                      disabled={index === 0 || reorderingSectionId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(section.id, "down")}
                      disabled={index === sectionList.length - 1 || reorderingSectionId !== null}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {section.name}
                      </h4>
                    </div>
                    {section.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {section.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Order: {section.order} | ID: {section.id.slice(0, 8)}...
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleManageModules(section)}
                      disabled={reorderingSectionId !== null || loadingModulesForSection === section.id}
                      className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50 px-3 py-1.5 border border-green-200 rounded-lg hover:bg-green-50"
                    >
                      {loadingModulesForSection === section.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                      Modules
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      disabled={reorderingSectionId !== null}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1 disabled:opacity-50 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      disabled={reorderingSectionId !== null}
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

export default SectionManager;
