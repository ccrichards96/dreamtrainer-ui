import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2, BookOpen, Users, Search, Tag, Megaphone, ChevronUp, ChevronDown, Folder, Plus, X, Save } from "lucide-react";
import { Course, Module, CourseGroup } from "../../types/modules";
import {
  getAllCourses,
  getAllCoursesGroups,
  getCourseById,
  getCourseWithModulesById,
  updateCourse,
  createCourse,
  createCourseGroup,
  addCourseToGroup,
} from "../../services/api/modules";
import {
  CourseEditor,
  ModuleManager,
  CategoryManager,
  AnnouncementManager,
} from "../../components/admin";

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseModules, setSelectedCourseModules] = useState<Module[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reorderingCourseId, setReorderingCourseId] = useState<string | null>(null);
  const [view, setView] = useState<
    "overview" | "course-edit" | "module-manage" | "category-manage" | "announcement-manage"
  >("overview");

  // Inline form states for new course
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    name: "",
    description: "",
    groupId: "",
  });
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Inline form states for new group
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load all courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, groupsResponse] = await Promise.all([
          getAllCourses(),
          getAllCoursesGroups(),
        ]);
        // Sort courses by order field, then by createdAt if order is the same
        const sortedCourses = (coursesResponse.data || []).sort((a: Course, b: Course) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setCourses(sortedCourses);
        setCourseGroups(groupsResponse.data || []);
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
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Group courses by their courseGroupId
  const getCoursesInGroup = (groupId: string) => {
    return filteredCourses
      .filter((course) => course.courseGroupId === groupId)
      .sort((a, b) => a.order - b.order);
  };

  const getUnassignedCourses = () => {
    return filteredCourses
      .filter((course) => !course.courseGroupId)
      .sort((a, b) => a.order - b.order);
  };

  const handleEditCourse = async (course: Course) => {
    try {
      setLoading(true);

      try {
        const response = await getCourseById(course.id);

        const courseData = response.data?.course || response.data || response;
        const modulesData = response.data?.modules || [];

        // Use the fetched data if available, otherwise fall back to the original course
        setSelectedCourse(courseData && courseData.id ? courseData : course);
        setSelectedCourseModules(modulesData);
      } catch (apiError) {
        console.warn("API call failed, using original course data:", apiError);
        // Fallback to the original course data if API fails
        setSelectedCourse(course);
        setSelectedCourseModules([]);
      }

      setView("course-edit");
    } catch (err) {
      setError("Failed to load course details");
      console.error("Error fetching course details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageModules = async (course: Course) => {
    try {
      setLoading(true);
      try {
        const response = await getCourseWithModulesById(course.id);

        const courseData = response.data || response;
        const modulesData = response.data?.modules || [];

        setSelectedCourse(courseData && courseData.id ? courseData : course);
        setSelectedCourseModules(modulesData);
      } catch (apiError) {
        console.warn("API call failed, using original course data:", apiError);
        setSelectedCourse(course);
        setSelectedCourseModules([]);
      }
      setView("module-manage");
    } catch (err) {
      setError("Failed to load course modules");
      console.error("Error fetching course modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedCourse(null);
    setSelectedCourseModules([]);
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
      const createdCourse = await createCourse({
        name: newCourseData.name.trim(),
        description: newCourseData.description.trim() || undefined,
      });

      // If a group was selected, assign the course to it
      if (newCourseData.groupId && createdCourse?.data?.id) {
        await addCourseToGroup(createdCourse.data.id, newCourseData.groupId);
      }

      setSuccessMessage("Course created successfully!");
      setNewCourseData({ name: "", description: "", groupId: "" });
      setShowNewCourseForm(false);
      await refreshCourses();
      await refreshGroups();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course";
      setError(errorMessage);
    } finally {
      setCreatingCourse(false);
    }
  };

  // Handle creating a new group inline
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupData.name.trim()) return;

    try {
      setCreatingGroup(true);
      setError(null);
      await createCourseGroup({
        name: newGroupData.name.trim(),
        description: newGroupData.description.trim() || undefined,
        image: newGroupData.image.trim() || undefined,
      });
      setSuccessMessage("Course group created successfully!");
      setNewGroupData({ name: "", description: "", image: "" });
      setShowNewGroupForm(false);
      await refreshGroups();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course group";
      setError(errorMessage);
    } finally {
      setCreatingGroup(false);
    }
  };

  const refreshGroups = async () => {
    try {
      const response = await getAllCoursesGroups();
      setCourseGroups(response.data || []);
    } catch (err) {
      console.error("Error refreshing groups:", err);
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

  const handleMoveCourse = async (courseId: string, direction: 'up' | 'down') => {
    const currentIndex = courses.findIndex(c => c.id === courseId);
    if (currentIndex === -1) return;

    // Prevent moving beyond bounds
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === courses.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
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
        updateCourse(newList[newIndex].id, { order: newList[newIndex].order })
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
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage courses, modules, and content
              </p>
            </div>
            <div className="flex items-center gap-4">
              {view !== "overview" && (
                <button
                  onClick={handleBackToOverview}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Overview
                </button>
              )}
              {view === "overview" && (
                <>
                  <button
                    onClick={() => setShowNewCourseForm(!showNewCourseForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Course Section
                  </button>
                  <button
                    onClick={() => setShowNewGroupForm(!showNewGroupForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Folder className="w-4 h-4" />
                    New Course
                  </button>
                </>
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
                    <h3 className="text-lg font-medium text-gray-900">Create New Course Section</h3>
                    <button
                      onClick={() => setShowNewCourseForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleCreateCourse} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Name *
                      </label>
                      <input
                        type="text"
                        value={newCourseData.name}
                        onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                        placeholder="Enter section name"
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
                        onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign to Course
                      </label>
                      <select
                        value={newCourseData.groupId}
                        onChange={(e) => setNewCourseData({ ...newCourseData, groupId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">No course (unassigned)</option>
                        {courseGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCourseForm(false);
                        setNewCourseData({ name: "", description: "", groupId: "" });
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
                          Create Course Section
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Inline New Group Form */}
            {showNewGroupForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-white rounded-lg shadow mb-6"
              >
                <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Create New Course</h3>
                    <button
                      onClick={() => setShowNewGroupForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleCreateGroup} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={newGroupData.name}
                        onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                        placeholder="Enter course name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newGroupData.description}
                        onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={newGroupData.image}
                        onChange={(e) => setNewGroupData({ ...newGroupData, image: e.target.value })}
                        placeholder="Enter image URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewGroupForm(false);
                        setNewGroupData({ name: "", description: "", image: "" });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingGroup || !newGroupData.name.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {creatingGroup ? (
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
                    <p className="text-sm font-medium text-gray-600">
                      Total Course Sections
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {courses.length}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Active Students
                    </p>
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
              {courseGroups.map((group) => {
                const groupCourses = getCoursesInGroup(group.id);
                return (
                  <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <Folder className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {group.name}
                          </h3>
                          {group.description && (
                            <p className="text-sm text-gray-500">{group.description}</p>
                          )}
                        </div>
                        <span className="ml-auto text-sm text-gray-500">
                          {groupCourses.length} course(s)
                        </span>
                      </div>
                    </div>
                    {groupCourses.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        No courses in this group
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
                            {groupCourses.map((course, index) => (
                              <tr key={course.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center gap-1 pt-1">
                                      <button
                                        onClick={() => handleMoveCourse(course.id, 'up')}
                                        disabled={index === 0 || reorderingCourseId !== null}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                                        title="Move up"
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleMoveCourse(course.id, 'down')}
                                        disabled={index === groupCourses.length - 1 || reorderingCourseId !== null}
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
                                      <div className="text-sm text-gray-500">
                                        ID: {course.id}
                                      </div>
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
                                      onClick={() => handleManageModules(course)}
                                      disabled={reorderingCourseId !== null}
                                      className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50"
                                    >
                                      <BookOpen className="w-4 h-4" />
                                      Modules
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
                );
              })}

              {/* Unassigned Courses */}
              {getUnassignedCourses().length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <Folder className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Unassigned Courses
                        </h3>
                        <p className="text-sm text-gray-500">
                          These courses are not assigned to any group
                        </p>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">
                        {getUnassignedCourses().length} course(s)
                      </span>
                    </div>
                  </div>
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
                        {getUnassignedCourses().map((course, index) => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                  <button
                                    onClick={() => handleMoveCourse(course.id, 'up')}
                                    disabled={index === 0 || reorderingCourseId !== null}
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                                    title="Move up"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveCourse(course.id, 'down')}
                                    disabled={index === getUnassignedCourses().length - 1 || reorderingCourseId !== null}
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
                                  <div className="text-sm text-gray-500">
                                    ID: {course.id}
                                  </div>
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
                                  onClick={() => handleManageModules(course)}
                                  disabled={reorderingCourseId !== null}
                                  className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50"
                                >
                                  <BookOpen className="w-4 h-4" />
                                  Modules
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
                </div>
              )}

              {/* Empty state */}
              {courseGroups.length === 0 && getUnassignedCourses().length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No courses or course groups found</p>
                </div>
              )}
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

        {/* Module Manager */}
        {view === "module-manage" &&
          (selectedCourse ? (
            <ModuleManager
              course={selectedCourse}
              modules={selectedCourseModules}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course modules...</p>
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
