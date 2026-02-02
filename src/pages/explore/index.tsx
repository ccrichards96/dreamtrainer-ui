import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAllCourses } from "../../services/api/modules";
import { getUserEnrollments } from "../../services/api/enrollment";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course } from "../../types/modules";
import type { CourseEnrollment } from "../../types/enrollment";
import { Breadcrumb } from "../../components/Breadcrumb";
import { AllCoursesView } from "./AllCoursesView";

const ExploreCoursesContent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses and enrollments in parallel
        const [coursesResponse, enrollmentsData] = await Promise.all([
          getAllCourses(),
          getUserEnrollments(),
        ]);

        // Sort courses by order field, then by createdAt
        const sortedCourses = (coursesResponse.data || []).sort((a: Course, b: Course) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setCourses(sortedCourses);
        setEnrollments(enrollmentsData);
      } catch (err) {
        console.error("Error fetching courses:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load courses";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
            <span className="ml-3 text-gray-600">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Breadcrumb items={[{ label: "All Courses", isActive: true }]} />
        <AllCoursesView courses={courses} enrollments={enrollments} />
      </div>
    </div>
  );
};

// Wrapper component that provides the Course context
export default function ExploreCourses() {
  return (
    <CourseProvider>
      <ExploreCoursesContent />
    </CourseProvider>
  );
}
