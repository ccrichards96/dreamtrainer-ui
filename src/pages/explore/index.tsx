import { useState, useEffect, useMemo } from "react";
import { Loader2, Search } from "lucide-react";
import { getAllCourses } from "../../services/api/modules";
import { getUserEnrollments } from "../../services/api/enrollment";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course } from "../../types/modules";
import type { CourseEnrollment } from "../../types/enrollment";
import { Breadcrumb } from "../../components/Breadcrumb";
import { AllCoursesView } from "./AllCoursesView";

type TabType = "my-courses" | "explore";

const ExploreCoursesContent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("my-courses");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Create a Set of enrolled course IDs for filtering
  const enrolledCourseIds = useMemo(
    () =>
      new Set(
        enrollments.filter((e) => e.courseId && !e.deletedAt).map((e) => e.courseId)
      ),
    [enrollments]
  );

  // Filter courses based on active tab and search query
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filter by tab
    if (activeTab === "my-courses") {
      filtered = filtered.filter((course) => enrolledCourseIds.has(course.id));
    } else {
      // Explore: show courses the user is NOT enrolled in
      filtered = filtered.filter((course) => !enrolledCourseIds.has(course.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [courses, activeTab, enrolledCourseIds, searchQuery]);

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
        <Breadcrumb
          items={[
            {
              label: activeTab === "my-courses" ? "My Courses" : "Explore New Courses",
              isActive: true,
            },
          ]}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("my-courses")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "my-courses"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "explore"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Explore New Courses
            </button>
          </div>
        </div>

        <AllCoursesView courses={filteredCourses} enrollments={enrollments} />
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
