import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Save, X, AlertCircle, Folder, Link, Unlink, BookOpen } from "lucide-react";
import { Course, CourseGroup } from "../../types/modules";
import {
  getAllCoursesGroups,
  getAllCourses,
  createCourseGroup,
  createCourse,
  addCourseToGroup,
  removeCourseFromGroup,
} from "../../services/api/modules";

const CourseGroupManager: React.FC = () => {
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New group form state
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  // New course form state
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    name: "",
    description: "",
    groupId: "",
  });
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Assignment state
  const [assigningCourse, setAssigningCourse] = useState<string | null>(null);
  const [selectedGroupForAssignment, setSelectedGroupForAssignment] = useState<string>("");

  // Load groups and courses
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [groupsResponse, coursesResponse] = await Promise.all([
        getAllCoursesGroups(),
        getAllCourses(),
      ]);
      setGroups(groupsResponse.data || []);
      setCourses(coursesResponse.data || []);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

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
      setSuccess("Course group created successfully!");
      setNewGroupData({ name: "", description: "", image: "" });
      setShowNewGroupForm(false);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course group";
      setError(errorMessage);
    } finally {
      setCreatingGroup(false);
    }
  };

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

      setSuccess("Course created successfully!");
      setNewCourseData({ name: "", description: "", groupId: "" });
      setShowNewCourseForm(false);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course";
      setError(errorMessage);
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleAssignCourse = async (courseId: string, groupId: string) => {
    if (!groupId) return;

    try {
      setAssigningCourse(courseId);
      setError(null);
      await addCourseToGroup(courseId, groupId);
      setSuccess("Course assigned to group successfully!");
      await fetchData();
      setSelectedGroupForAssignment("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign course to group";
      setError(errorMessage);
    } finally {
      setAssigningCourse(null);
    }
  };

  const handleRemoveCourseFromGroup = async (courseId: string) => {
    try {
      setAssigningCourse(courseId);
      setError(null);
      await removeCourseFromGroup(courseId);
      setSuccess("Course removed from group successfully!");
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove course from group";
      setError(errorMessage);
    } finally {
      setAssigningCourse(null);
    }
  };

  // Group courses by their courseGroupId
  const getCoursesInGroup = (groupId: string) => {
    return courses.filter((course) => course.courseGroupId === groupId);
  };

  const getUnassignedCourses = () => {
    return courses.filter((course) => !course.courseGroupId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course groups...</p>
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
              <h3 className="text-lg font-medium text-gray-900">Courses</h3>
              <p className="text-sm text-gray-500">Create and manage courses</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowNewCourseForm(true);
                  setShowNewGroupForm(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                New Course Section
              </button>
              <button
                onClick={() => {
                  setShowNewGroupForm(true);
                  setShowNewCourseForm(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Group
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* New Group Form */}
        {showNewGroupForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <h4 className="font-medium text-gray-900">Create New Course</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={newGroupData.name}
                    onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newGroupData.image}
                    onChange={(e) => setNewGroupData({ ...newGroupData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL (optional)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGroupData.description}
                  onChange={(e) =>
                    setNewGroupData({ ...newGroupData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter group description (optional)"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={creatingGroup || !newGroupData.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {creatingGroup ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Group
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewGroupForm(false);
                    setNewGroupData({ name: "", description: "", image: "" });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* New Course Form */}
        {showNewCourseForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <h4 className="font-medium text-gray-900">Create New Course Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={newCourseData.name}
                    onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Group
                  </label>
                  <select
                    value={newCourseData.groupId}
                    onChange={(e) =>
                      setNewCourseData({ ...newCourseData, groupId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">No group (unassigned)</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newCourseData.description}
                  onChange={(e) =>
                    setNewCourseData({ ...newCourseData, description: e.target.value })
                  }
                  rows={2}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter course description"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={
                    creatingCourse ||
                    !newCourseData.name.trim() ||
                    !newCourseData.description.trim()
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
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
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCourseForm(false);
                    setNewCourseData({ name: "", description: "", groupId: "" });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Course Groups List */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{group.name}</h4>
                  {group.description && (
                    <p className="text-sm text-gray-500">{group.description}</p>
                  )}
                </div>
                <span className="ml-auto text-sm text-gray-500">
                  {getCoursesInGroup(group.id).length} course(s)
                </span>
              </div>
            </div>
            <div className="p-4">
              {getCoursesInGroup(group.id).length === 0 ? (
                <p className="text-gray-500 text-sm italic">No courses assigned to this group</p>
              ) : (
                <ul className="space-y-2">
                  {getCoursesInGroup(group.id).map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{course.name}</span>
                        {course.description && (
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCourseFromGroup(course.id)}
                        disabled={assigningCourse === course.id}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm disabled:opacity-50"
                      >
                        {assigningCourse === course.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <Unlink className="w-4 h-4" />
                            Unlink Course
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No course groups created yet</p>
            <button
              onClick={() => setShowNewGroupForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Create your first group
            </button>
          </div>
        )}
      </div>

      {/* Unassigned Courses */}
      {getUnassignedCourses().length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
            <h4 className="font-medium text-gray-900">Unassigned Courses</h4>
            <p className="text-sm text-gray-500">These courses are not assigned to any group</p>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {getUnassignedCourses().map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">{course.name}</span>
                    {course.description && (
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedGroupForAssignment}
                      onChange={(e) => setSelectedGroupForAssignment(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select group...</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssignCourse(course.id, selectedGroupForAssignment)}
                      disabled={!selectedGroupForAssignment || assigningCourse === course.id}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                    >
                      {assigningCourse === course.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Link className="w-4 h-4" />
                          Assign
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CourseGroupManager;
