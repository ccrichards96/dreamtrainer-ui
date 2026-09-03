import React, { useEffect, useState } from "react";
import { Routes, Route, useMatch, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Course } from "../../types/modules";
import { Category } from "../../types/categories";
import { getAllCourses } from "../../services/api/modules";
import { getAllCategories } from "../../services/api/categories";
import {
  AdminSidebar,
  AnnouncementManager,
  UsersManager,
  CategoryManager,
} from "../../components/admin";
import type { AdminView } from "../../components/admin";
import CoursesOverview from "./CoursesOverview";
import CourseEditPage from "./CourseEditPage";
import SectionManagePage from "./SectionManagePage";
import ModuleManagePage from "./ModuleManagePage";

const sortCourses = (list: Course[]) =>
  [...list].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const refreshCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(sortCourses(response.data || []));
    } catch (err) {
      console.error("Error refreshing courses:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getAllCourses();
        setCourses(sortCourses(response.data || []));
      } catch (err) {
        setError("Failed to load courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Route matches drive both the sidebar highlight and the contextual back
  // button — real Router matching instead of hand-parsing the pathname.
  const courseEditMatch = useMatch("/admin/courses/:courseId");
  const sectionManageMatch = useMatch("/admin/courses/:courseId/sections");
  const moduleManageMatch = useMatch("/admin/courses/:courseId/sections/:sectionId/modules");

  const activeView: AdminView = courseEditMatch
    ? "course-edit"
    : sectionManageMatch
      ? "section-manage"
      : moduleManageMatch
        ? "module-manage"
        : "overview";

  const viewPaths: Record<AdminView, string> = {
    overview: "/admin",
    "course-edit": "/admin",
    "section-manage": "/admin",
    "module-manage": "/admin",
    "user-manage": "/admin/users",
    "category-manage": "/admin/categories",
    "announcement-manage": "/admin/announcements",
  };

  const handleSidebarNavigate = (target: AdminView) => navigate(viewPaths[target]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-gray-100 pt-16">
      {/* Sidebar */}
      <AdminSidebar activeView={activeView} onNavigate={handleSidebarNavigate} />

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:ps-80 py-6">
        {/* Contextual back buttons */}
        {moduleManageMatch && (
          <button
            onClick={() => navigate(`/admin/courses/${moduleManageMatch.params.courseId}/sections`)}
            className="mb-4 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sections
          </button>
        )}
        {(courseEditMatch || sectionManageMatch) && (
          <button
            onClick={() => navigate("/admin")}
            className="mb-4 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        )}

        <Routes>
          <Route
            index
            element={
              <CoursesOverview
                courses={courses}
                setCourses={setCourses}
                categories={categories}
                loadingCategories={loadingCategories}
                loading={loading}
                error={error}
                setError={setError}
                refreshCourses={refreshCourses}
              />
            }
          />
          <Route
            path="courses/:courseId"
            element={<CourseEditPage onSave={refreshCourses} />}
          />
          <Route path="courses/:courseId/sections" element={<SectionManagePage />} />
          <Route
            path="courses/:courseId/sections/:sectionId/modules"
            element={<ModuleManagePage />}
          />
          <Route path="announcements" element={<AnnouncementManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="categories" element={<CategoryManager />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
