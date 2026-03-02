import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, X, AlertCircle, AlertTriangle } from "lucide-react";
import { Course, CourseStatus, ListingStatus } from "../../types/modules";
import { Category } from "../../types/categories";
import { User } from "../../types/user";
import { updateCourse } from "../../services/api/modules";
import { getAllCategories } from "../../services/api/categories";
import { getAllUsers } from "../../services/api/admin";

interface CourseEditorProps {
  course: Course;
  onSave: () => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: "Draft",
  [CourseStatus.PENDING_REVIEW]: "Pending Review",
  [CourseStatus.PUBLISHED]: "Published",
  [CourseStatus.ARCHIVED]: "Archived",
};

const STATUS_COLORS: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: "bg-gray-100 text-gray-700",
  [CourseStatus.PENDING_REVIEW]: "bg-yellow-100 text-yellow-700",
  [CourseStatus.PUBLISHED]: "bg-green-100 text-green-700",
  [CourseStatus.ARCHIVED]: "bg-red-100 text-red-700",
};

// Tag input for arrays like learningObjectives, prerequisites, targetAudiences
function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white flex flex-wrap gap-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {values.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="hover:text-blue-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter or click away to add an item</p>
    </div>
  );
}

const CourseEditor: React.FC<CourseEditorProps> = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: course.name || "",
    description: course.description || "",
    imageUrl: course.imageUrl || "",
    slug: course.slug || "",
    categoryId: course.categoryId || "",
    expertProfileId: course.expertProfileId || "",
    status: course.status || CourseStatus.DRAFT,
    listingStatus: course.listingStatus || ListingStatus.PRIVATE,
    welcomeVideoUrl: course.welcomeVideoUrl || "",
    learningObjectives: course.learningObjectives || [],
    prerequisites: course.prerequisites || [],
    targetAudiences: course.targetAudiences || [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [expertUsers, setExpertUsers] = useState<User[]>([]);
  const [expertSearch, setExpertSearch] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoadingCategories(false));

    getAllUsers()
      .then((users) => setExpertUsers(users.filter((u) => u.expertProfile !== null)))
      .catch(() => setError("Failed to load expert users"))
      .finally(() => setLoadingExperts(false));
  }, []);

  const filteredExperts = expertUsers.filter((u) => {
    const q = expertSearch.toLowerCase();
    return (
      u.expertProfile!.displayName.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Intercept status change to published — show confirm
    if (
      name === "status" &&
      value === CourseStatus.PUBLISHED &&
      formData.status !== CourseStatus.PUBLISHED
    ) {
      setShowPublishConfirm(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const confirmPublish = () => {
    setFormData((prev) => ({ ...prev, status: CourseStatus.PUBLISHED }));
    setShowPublishConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateCourse(course.id, {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
        slug: formData.slug || undefined,
        categoryId: formData.categoryId || null,
        expertProfileId: formData.expertProfileId || null,
        status: formData.status,
        listingStatus: formData.listingStatus,
        welcomeVideoUrl: formData.welcomeVideoUrl || null,
        learningObjectives: formData.learningObjectives,
        prerequisites: formData.prerequisites,
        targetAudiences: formData.targetAudiences,
      });

      setSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err) {
      setError("Failed to update course. Please try again.");
      console.error("Error updating course:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Edit Course</h3>
            <p className="text-sm text-gray-500">ID: {course.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[formData.status as CourseStatus] || "bg-gray-100 text-gray-700"}`}
            >
              {STATUS_LABELS[formData.status as CourseStatus] || formData.status}
            </span>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700">Course updated successfully!</span>
          </div>
        )}

        {/* Publish confirm banner */}
        {showPublishConfirm && (
          <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Publish this course?</p>
              <p className="text-sm text-yellow-700 mt-1">
                Publishing will make this course visible based on its listing status. This action
                can be reversed by setting the status back to Draft or Archived.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={confirmPublish}
                  className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                >
                  Yes, Publish
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishConfirm(false)}
                  className="px-3 py-1.5 bg-white text-yellow-700 border border-yellow-300 text-sm rounded-lg hover:bg-yellow-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Status & Visibility */}
        <section>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Status &amp; Visibility
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Course Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {Object.values(CourseStatus).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              {course.status === CourseStatus.DRAFT && (
                <p className="text-xs text-gray-400 mt-1">
                  Currently in Draft — select Published to go live.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="listingStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Listing Status
              </label>
              <select
                id="listingStatus"
                name="listingStatus"
                value={formData.listingStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value={ListingStatus.PRIVATE}>Private — invite-only</option>
                <option value={ListingStatus.PUBLIC}>Public — visible in catalog</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section: Basic Info */}
        <section>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="course-slug"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">{loadingCategories ? "Loading…" : "— No Category —"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Owner (Expert)
              </label>
              <input
                type="text"
                value={expertSearch}
                onChange={(e) => setExpertSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full px-3 py-2 border border-gray-300 rounded-t-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <select
                id="expertProfileId"
                name="expertProfileId"
                value={formData.expertProfileId}
                onChange={handleInputChange}
                disabled={loadingExperts}
                className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">{loadingExperts ? "Loading experts…" : "— No Owner —"}</option>
                {filteredExperts.map((u) => (
                  <option key={u.expertProfile!.id} value={u.expertProfile!.id}>
                    {u.expertProfile!.displayName} — {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
              {formData.expertProfileId && (
                <p className="text-xs text-gray-400 mt-1">
                  Expert profile ID: {formData.expertProfileId}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Course thumbnail preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="welcomeVideoUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Welcome Video URL
              </label>
              <input
                type="url"
                id="welcomeVideoUrl"
                name="welcomeVideoUrl"
                value={formData.welcomeVideoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Section: Learning Details */}
        <section>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Learning Details
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <TagInput
              label="Learning Objectives"
              values={formData.learningObjectives}
              onChange={(v) => setFormData((p) => ({ ...p, learningObjectives: v }))}
              placeholder="e.g. Learn English grammar"
            />
            <TagInput
              label="Prerequisites"
              values={formData.prerequisites}
              onChange={(v) => setFormData((p) => ({ ...p, prerequisites: v }))}
              placeholder="e.g. Basic English reading"
            />
            <TagInput
              label="Target Audiences"
              values={formData.targetAudiences}
              onChange={(v) => setFormData((p) => ({ ...p, targetAudiences: v }))}
              placeholder="e.g. Foreign English speakers"
            />
          </div>
        </section>

        {/* Section: Metadata (read-only) */}
        <section>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Metadata
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stripe Product ID
              </label>
              <input
                type="text"
                value={course.stripeProductId || "—"}
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <input
                type="text"
                value={new Date(course.createdAt).toLocaleString()}
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <input
                type="text"
                value={new Date(course.updatedAt).toLocaleString()}
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CourseEditor;
