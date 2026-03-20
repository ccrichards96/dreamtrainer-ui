import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Save, X, AlertCircle, Copy, Check, UserPlus, Trash2, Loader2, ChevronDown } from "lucide-react";
import { Course, CourseExpert, CourseStatus, ListingStatus } from "../../types/modules";
import { Category } from "../../types/categories";
import { User } from "../../types/user";
import { updateCourse } from "../../services/api/modules";
import courseExpertsService from "../../services/api/course-experts";
import { getAllCategories } from "../../services/api/categories";
import { getUsersPaginated } from "../../services/api/admin";

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
    status: course.status || CourseStatus.DRAFT,
    listingStatus: course.listingStatus || ListingStatus.PRIVATE,
    welcomeVideoUrl: course.welcomeVideoUrl || "",
    featuredVideoUrl: course.featuredVideoUrl || "",
    learningObjectives: course.learningObjectives || [],
    prerequisites: course.prerequisites || [],
    targetAudiences: course.targetAudiences || [],
    stripeProductId: course.stripeProductId || "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [expertUsers, setExpertUsers] = useState<User[]>([]);
  const [courseExperts, setCourseExperts] = useState<CourseExpert[]>([]);

  // Selection state for adding a new expert
  const [expertSearch, setExpertSearch] = useState("");
  const [selectedExpertProfileId, setSelectedExpertProfileId] = useState("");
  const [selectedExpertLabel, setSelectedExpertLabel] = useState("");
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"owner" | "support-expert">("support-expert");
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingExpertsList, setLoadingExpertsList] = useState(false);
  const [loadingCourseExperts, setLoadingCourseExperts] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expertSuccess, setExpertSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoadingCategories(false));

    if (course.id) {
      setLoadingCourseExperts(true);
      courseExpertsService
        .getExpertsByCourse(course.id)
        .then((experts) => setCourseExperts(experts))
        .catch(() => setError("Failed to load course experts"))
        .finally(() => setLoadingCourseExperts(false));
    } else {
      setLoadingCourseExperts(false);
    }
  }, [course.id]);

  // Debounced expert search - only fires when user is actively searching
  useEffect(() => {
    if (!showExpertDropdown && expertSearch.trim() === "") return;

    const fetchExperts = async () => {
      setLoadingExpertsList(true);
      try {
        const res = await getUsersPaginated({
          search: expertSearch.trim() || undefined,
          limit: 20,
        });
        const experts = res.users.filter(
          (u) => u.expertProfile && u.expertProfile.id
        );
        setExpertUsers(experts);
      } catch (err) {
        console.error("Expert search error:", err);
      } finally {
        setLoadingExpertsList(false);
      }
    };

    const timer = setTimeout(fetchExperts, 300);
    return () => clearTimeout(timer);
  }, [expertSearch, showExpertDropdown]);

  // Close combobox dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setShowExpertDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredExperts = expertUsers.filter((u) => {
    return !courseExperts.some((ce) => ce.expertProfileId === u.expertProfile?.id);
  });

  const handleSelectExpert = useCallback((user: User) => {
    setSelectedExpertProfileId(user.expertProfile!.id);
    setSelectedExpertLabel(`${user.expertProfile!.displayName} (${user.email})`);
    setShowExpertDropdown(false);
    setExpertSearch("");
  }, []);

  const handleAddExpert = async () => {
    if (!selectedExpertProfileId || !course.id) return;

    setActionLoadingId("add");
    try {
      const newExpert = await courseExpertsService.createCourseExpert({
        expertProfileId: selectedExpertProfileId,
        courseId: course.id,
        role: selectedRole,
      });
      // Try to find the user profile info to render it immediately
      const matchedUser = expertUsers.find((u) => u.expertProfile?.id === selectedExpertProfileId);
      if (matchedUser && matchedUser.expertProfile) {
        newExpert.expertProfile = matchedUser.expertProfile;
      }
      setCourseExperts((prev) => [...prev, newExpert]);
      setSelectedExpertProfileId("");
      setSelectedExpertLabel("");
      setExpertSearch("");
      setExpertSuccess("Course experts updated successfully");
      setTimeout(() => setExpertSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add expert");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateExpertRole = async (expertId: string, newRole: "owner" | "support-expert") => {
    setActionLoadingId(expertId);
    try {
      const updated = await courseExpertsService.updateCourseExpert(expertId, { role: newRole });
      setCourseExperts((prev) =>
        prev.map((ce) => (ce.id === expertId ? { ...ce, role: updated.role } : ce))
      );
      setExpertSuccess("Course experts updated successfully");
      setTimeout(() => setExpertSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update expert role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveExpert = async (expertId: string) => {
    setActionLoadingId(expertId);
    try {
      await courseExpertsService.deleteCourseExpert(expertId);
      setCourseExperts((prev) => prev.filter((ce) => ce.id !== expertId));
      setExpertSuccess("Course experts updated successfully");
      setTimeout(() => setExpertSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to remove expert");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
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
        status: formData.status,
        listingStatus: formData.listingStatus,
        welcomeVideoUrl: formData.welcomeVideoUrl || null,
        featuredVideoUrl: formData.featuredVideoUrl || null,
        learningObjectives: formData.learningObjectives,
        prerequisites: formData.prerequisites,
        targetAudiences: formData.targetAudiences,
        stripeProductId: formData.stripeProductId || null,
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

            {/* Image and Wrapper Fields */}

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

            <div>
              <label
                htmlFor="featuredVideoUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Featured Video URL
              </label>
              <input
                type="url"
                id="featuredVideoUrl"
                name="featuredVideoUrl"
                value={formData.featuredVideoUrl}
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
              <label
                htmlFor="stripeProductId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stripe Product ID
              </label>
              <input
                type="text"
                id="stripeProductId"
                name="stripeProductId"
                value={formData.stripeProductId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="prod_..."
              />
            </div>
            {formData.slug && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sign-up Link</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-600 truncate">
                    {`${window.location.origin}/signup?course=${formData.slug}`}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/signup?course=${formData.slug}`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center gap-1.5 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

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

        {/* Section: Course Experts Management */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Course Experts
            </h4>
          </div>
          <div className="space-y-4">
            {expertSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700">{expertSuccess}</span>
              </div>
            )}

            {loadingCourseExperts ? (
              <div className="flex justify-center p-6 border border-gray-200 border-dashed rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : courseExperts.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Expert
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseExperts.map((expert) => (
                      <tr key={expert.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {expert.expertProfile?.avatarUrl ? (
                              <img
                                className="h-8 w-8 rounded-full object-cover border border-gray-300"
                                src={expert.expertProfile.avatarUrl}
                                alt=""
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium border border-blue-200">
                                {expert.expertProfile?.displayName?.charAt(0) || "?"}
                              </div>
                            )}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {expert.expertProfile?.displayName || "Unknown Expert"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {actionLoadingId === expert.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          ) : (
                            <select
                              value={expert.role}
                              onChange={(e) =>
                                handleUpdateExpertRole(
                                  expert.id,
                                  e.target.value as "owner" | "support-expert"
                                )
                              }
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="owner">Owner</option>
                              <option value="support-expert">Support Expert</option>
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveExpert(expert.id)}
                            disabled={actionLoadingId === expert.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 border border-gray-200 border-dashed rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500 mb-1">No experts assigned yet.</p>
                <p className="text-xs text-gray-400">
                  Assign an expert below to let them manage or support this course.
                </p>
              </div>
            )}

            {/* Add New Expert Panel */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Assign New Expert
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-blue-800 mb-1">
                    Search & Select Expert
                  </label>
                  <div ref={comboboxRef} className="relative">
                    {/* Combobox Input */}
                    <div className="relative">
                      <input
                        type="text"
                        role="combobox"
                        aria-expanded={showExpertDropdown}
                        value={showExpertDropdown ? expertSearch : selectedExpertLabel || expertSearch}
                        onChange={(e) => {
                          setExpertSearch(e.target.value);
                          setShowExpertDropdown(true);
                          // Clear selection if user is editing
                          if (selectedExpertProfileId) {
                            setSelectedExpertProfileId("");
                            setSelectedExpertLabel("");
                          }
                        }}
                        onFocus={() => {
                          setShowExpertDropdown(true);
                          if (selectedExpertLabel) {
                            setExpertSearch("");
                          }
                        }}
                        placeholder="Search by name or email…"
                        className="w-full px-3 py-2.5 pe-9 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
                        {loadingExpertsList && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        )}
                        {selectedExpertProfileId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExpertProfileId("");
                              setSelectedExpertLabel("");
                              setExpertSearch("");
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!loadingExpertsList && !selectedExpertProfileId && (
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Combobox Dropdown */}
                    {showExpertDropdown && (
                      <div
                        className="absolute z-50 w-full mt-1 max-h-60 p-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto"
                        role="listbox"
                      >
                        {filteredExperts.length === 0 ? (
                          <div className="py-3 px-4 text-sm text-gray-500 text-center">
                            {loadingExpertsList
                              ? "Searching…"
                              : expertSearch.trim()
                              ? "No matching experts found"
                              : "Type to search for experts"}
                          </div>
                        ) : (
                          filteredExperts.map((u) => (
                            <div
                              key={u.expertProfile!.id}
                              role="option"
                              aria-selected={selectedExpertProfileId === u.expertProfile!.id}
                              className={`cursor-pointer py-2 px-3 w-full text-sm rounded-lg flex justify-between items-center ${
                                selectedExpertProfileId === u.expertProfile!.id
                                  ? "bg-blue-50 text-blue-800"
                                  : "text-gray-800 hover:bg-gray-100"
                              }`}
                              onClick={() => handleSelectExpert(u)}
                            >
                              <div>
                                <span className="font-medium">
                                  {u.expertProfile!.displayName}
                                </span>
                                <span className="text-gray-500 ml-1.5 text-xs">
                                  {u.email}
                                </span>
                              </div>
                              {selectedExpertProfileId === u.expertProfile!.id && (
                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-blue-800 mb-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as "owner" | "support-expert")}
                    className="w-full px-3 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="owner">Owner (Full Access)</option>
                    <option value="support-expert">Support Expert (Messages & Feedback)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button
                    type="button"
                    onClick={handleAddExpert}
                    disabled={!selectedExpertProfileId || actionLoadingId === "add"}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {actionLoadingId === "add" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Assign Expert"
                    )}
                  </button>
                </div>
              </div>
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
