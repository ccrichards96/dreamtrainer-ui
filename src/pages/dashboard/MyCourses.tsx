import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, Compass, Play, RefreshCw } from "lucide-react";
import { getMyCourses } from "../../services/api/modules";
import type { Course } from "../../types/modules";
import StudentDashboardLayout from "./StudentDashboardLayout";

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastCourseSlug = localStorage.getItem("last_course_slug");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyCourses();
        setCourses(response.data || []);
      } catch (err) {
        console.error("Error fetching my courses:", err);
        setError((err as { message?: string }).message || "Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleContinue = (course: Course) => {
    // Resume the section the student was last on when returning to that course
    const lastSectionId = localStorage.getItem("last_section_id");
    if (course.slug === lastCourseSlug && lastSectionId) {
      localStorage.setItem("selected_section_id", lastSectionId);
    }
    navigate(`/courses/${course.slug}/dashboard`);
  };

  // Most recently visited course first, otherwise keep the API order
  const sortedCourses = [...courses].sort(
    (a, b) => Number(b.slug === lastCourseSlug) - Number(a.slug === lastCourseSlug)
  );

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Pick up where you left off in any of your courses.</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-lg text-gray-600">Loading your courses...</span>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-medium text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h2>
            <p className="text-gray-600 mb-6">Once you enroll in a course it will show up here.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Compass className="w-5 h-5" />
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCourses.map((course, index) => {
              const isLastVisited = course.slug === lastCourseSlug;
              return (
                <motion.button
                  key={course.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.05 }}
                  onClick={() => handleContinue(course)}
                  className="group flex flex-col text-left bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative h-44 bg-gray-50">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {isLastVisited && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                        Last visited
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h2>
                    {course.expertProfile?.displayName && (
                      <p className="text-sm text-gray-500 mb-2">
                        with {course.expertProfile.displayName}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-5">{course.description}</p>
                    <span className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-3 rounded-lg font-medium group-hover:bg-purple-700 transition-colors">
                      <Play className="w-4 h-4" />
                      Continue Course
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}
