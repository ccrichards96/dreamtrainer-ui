import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit3,
  Trash2,
  BookOpen,
  Users,
  Search,
  Tag,
  Megaphone,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
  Save,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { Course, Section, Module } from "../../types/modules";
import {
  getAllCourses,
  getCourseById,
  updateCourse,
  createCourse,
} from "../../services/api/modules";
import {
  CourseEditor,
  ModuleManager,
  CategoryManager,
  AnnouncementManager,
  SectionManager,
} from "../../components/admin";

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSectionModules, setSelectedSectionModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reorderingCourseId, setReorderingCourseId] = useState<string | null>(null);
  const [view, setView] = useState<
    "overview" | "course-edit" | "section-manage" | "module-manage" | "category-manage" | "announcement-manage"
  >("overview");

  // Inline form states for new course
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    name: "",
    description: "",
  });
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load all courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await getAllCourses();
        // Sort courses by order field, then by createdAt if order is the same
        const sortedCourses = (coursesResponse.data || []).sort((a: Course, b: Course) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setCourses(sortedCourses);
      } catch (err) {
        setError("Failed to load courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = async (course: Course) => {
    try {
      setLoading(true);

      try {
        const response = await getCourseById(course.id);
        const courseData = response.data || course;
        setSelectedCourse(courseData);
      } catch (apiError) {
        console.warn("API call failed, using original course data:", apiError);
        setSelectedCourse(course);
      }

      setView("course-edit");
    } catch (err) {
      setError("Failed to load course details");
      console.error("Error fetching course details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSections = async (course: Course) => {
    setSelectedCourse(course);
    setView("section-manage");
  };

  // Called from SectionManager when user wants to manage modules for a section
  const handleManageModulesForSection = (section: Section, modules: Module[]) => {
    setSelectedSection(section);
    setSelectedSectionModules(modules);
    setView("module-manage");
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedCourse(null);
    setSelectedSection(null);
    setSelectedSectionModules([]);
  };

  const handleBackToSections = () => {
    setView("section-manage");
    setSelectedSection(null);
    setSelectedSectionModules([]);
  };

  const handleManageCategories = () => {
    setView("category-manage");
  };

  const handleManageAnnouncements = () => {
    setView("announcement-manage");
  };

  // Handle creating a new course inline
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseData.name.trim()) return;

    try {
      setCreatingCourse(true);
      setError(null);
      await createCourse({
        name: newCourseData.name.trim(),
        description: newCourseData.description.trim() || undefined,
      });

      setSuccessMessage("Course created successfully!");
      setNewCourseData({ name: "", description: "" });
      setShowNewCourseForm(false);
      await refreshCourses();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course";
      setError(errorMessage);
    } finally {
      setCreatingCourse(false);
    }
  };

  const refreshCourses = async () => {
    try {
      const response = await getAllCourses();
      // Sort courses by order field, then by createdAt if order is the same
      const sortedCourses = (response.data || []).sort((a: Course, b: Course) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setCourses(sortedCourses);
    } catch (err) {
      console.error("Error refreshing courses:", err);
    }
  };

  const handleMoveCourse = async (courseId: string, direction: "up" | "down") => {
    const currentIndex = courses.findIndex((c) => c.id === courseId);
    if (currentIndex === -1) return;

    // Prevent moving beyond bounds
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === courses.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newList = [...courses];

    // Swap positions
    [newList[currentIndex], newList[newIndex]] = [newList[newIndex], newList[currentIndex]];

    // Update order values
    newList.forEach((course, index) => {
      course.order = index;
    });

    // Optimistically update UI
    setCourses(newList);
    setReorderingCourseId(courseId);

    try {
      // Update both courses' order on backend
      await Promise.all([
        updateCourse(newList[currentIndex].id, { order: newList[currentIndex].order }),
        updateCourse(newList[newIndex].id, { order: newList[newIndex].order }),
      ]);
    } catch (err) {
      setError("Failed to reorder courses. Please refresh the page.");
      console.error("Error reordering courses:", err);
      // Revert on error
      await refreshCourses();
    } finally {
      setReorderingCourseId(null);
    }
  };

  if (loading && view === "overview") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && view === "overview") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage courses, sections, and modules</p>
            </div>
            <div className="flex items-center gap-4">
              {view === "module-manage" && selectedSection && (
                <button
                  onClick={handleBackToSections}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sections
                </button>
              )}
              {view !== "overview" && view !== "module-manage" && (
                <button
                  onClick={handleBackToOverview}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Overview
                </button>
              )}
              {view === "overview" && (
                <button
                  onClick={() => setShowNewCourseForm(!showNewCourseForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Course
                </button>
              )}
              <button
                onClick={handleManageCategories}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Manage Categories
              </button>
              <button
                onClick={handleManageAnnouncements}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                Manage Announcements
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {view === "overview" && (
          <>
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <div className="text-green-600 font-medium">{successMessage}</div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
              >
                <div className="text-red-600 font-medium">{error}</div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Inline New Course Form */}
            {showNewCourseForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-white rounded-lg shadow mb-6"
              >
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Create New Course</h3>
                    <button
                      onClick={() => setShowNewCourseForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleCreateCourse} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={newCourseData.name}
                        onChange={(e) =>
                          setNewCourseData({ ...newCourseData, name: e.target.value })
                        }
                        placeholder="Enter course name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newCourseData.description}
                        onChange={(e) =>
                          setNewCourseData({ ...newCourseData, description: e.target.value })
                        }
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCourseForm(false);
                        setNewCourseData({ name: "", description: "" });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCourse || !newCourseData.name.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {creatingCourse ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Create Course
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grouped by Course Groups */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">All Courses</h3>
                      <p className="text-sm text-gray-500">
                        Manage courses and their sections
                      </p>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {filteredCourses.length} course(s)
                    </span>
                  </div>
                </div>
                {filteredCourses.length === 0 ? (
                  <div className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No courses found. Create your first course to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.map((course, index) => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                  <button
                                    onClick={() => handleMoveCourse(course.id, "up")}
                                    disabled={index === 0 || reorderingCourseId !== null}
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                                    title="Move up"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveCourse(course.id, "down")}
                                    disabled={
                                      index === filteredCourses.length - 1 ||
                                      reorderingCourseId !== null
                                    }
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                                    title="Move down"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {course.name}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {course.id.slice(0, 8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {course.description || "No description"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(course.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditCourse(course)}
                                  disabled={reorderingCourseId !== null}
                                  className="text-blue-600 hover:text-blue-900 flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleManageSections(course)}
                                  disabled={reorderingCourseId !== null}
                                  className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Layers className="w-4 h-4" />
                                  Sections
                                </button>
                                <button
                                  disabled={reorderingCourseId !== null}
                                  className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Course Editor */}
        {view === "course-edit" &&
          (selectedCourse ? (
            <CourseEditor
              course={selectedCourse}
              onSave={refreshCourses}
              onCancel={handleBackToOverview}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
              </div>
            </div>
          ))}

        {/* Section Manager */}
        {view === "section-manage" &&
          (selectedCourse ? (
            <SectionManager
              course={selectedCourse}
              onManageModules={handleManageModulesForSection}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course sections...</p>
              </div>
            </div>
          ))}

        {/* Module Manager */}
        {view === "module-manage" &&
          (selectedSection ? (
            <ModuleManager section={selectedSection} modules={selectedSectionModules} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading section modules...</p>
              </div>
            </div>
          ))}

        {/* Category Manager */}
        {view === "category-manage" && <CategoryManager />}

        {/* Announcement Manager */}
        {view === "announcement-manage" && <AnnouncementManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
