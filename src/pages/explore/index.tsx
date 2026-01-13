import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAllCourses } from "../../services/api/modules";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course } from "../../types/modules";
import { Breadcrumb } from "../../components/Breadcrumb";
import { CourseDetail } from "./CourseDetail";
import { AllCoursesView } from "./AllCoursesView";

const ExploreCoursesContent = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const coursesResponse = await getAllCourses();

        // Sort courses by order field, then by createdAt
        const sortedCourses = (coursesResponse.data || []).sort(
          (a: Course, b: Course) => {
            if (a.order !== b.order) {
              return a.order - b.order;
            }
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
        );

        setCourses(sortedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load courses";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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

  // Main view - All courses
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <Breadcrumb items={[{ label: "All Courses", isActive: true }]} />

          <AllCoursesView
            courses={courses}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        </div>
      </div>
    );
  }

  // Detail view - Selected course
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Breadcrumb
          items={[
            { label: "All Courses", onClick: () => setSelectedCourse(null) },
            { label: selectedCourse.name, isActive: true },
          ]}
        />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.name}</h1>
              <p className="text-gray-600 mt-2">
                {selectedCourse.description || "Select a section to begin"}
              </p>
            </div>
          </div>
        </div>

        {/* Course Detail Content - shows sections */}
        <CourseDetail course={selectedCourse} />
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
