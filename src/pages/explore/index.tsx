import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAllCoursesGroups, getAllCourses } from "../../services/api/modules";
import { CourseProvider } from "../../contexts/CourseContext";
import type { Course, CourseGroup } from "../../types/modules";
import { Breadcrumb } from "../../components/Breadcrumb";
import { CourseGroupDetail } from "./CourseGroupDetail";
import { AllCoursesView } from "./AllCoursesView";

interface CourseGroupWithCourses extends CourseGroup {
  courses: Course[];
}

const ExploreCoursesContent = () => {
  const [selectedGroup, setSelectedGroup] = useState<CourseGroupWithCourses | null>(null);
  const [courseGroups, setCourseGroups] = useState<CourseGroupWithCourses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const [groupsResponse, coursesResponse] = await Promise.all([
          getAllCoursesGroups(),
          getAllCourses(),
        ]);

        // Group courses by courseGroupId
        const groupedData: CourseGroupWithCourses[] = groupsResponse.data
          .map((group: CourseGroup) => {
            const groupCourses = coursesResponse.data
              .filter((course: Course) => course.courseGroupId === group.id)
              .sort(
                (a: Course, b: Course) =>
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );

            return {
              ...group,
              courses: groupCourses,
            };
          })
          .sort(
            (a: CourseGroupWithCourses, b: CourseGroupWithCourses) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        setCourseGroups(groupedData);
      } catch (err) {
        console.error("Error fetching course groups:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load course groups";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseGroups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
            <span className="ml-3 text-gray-600">Loading course groups...</span>
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

  // Main view - All course groups
  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
          <Breadcrumb items={[{ label: "All Courses", isActive: true }]} />

          <AllCoursesView
            courseGroups={courseGroups}
            onSelectGroup={(group) => setSelectedGroup(group as CourseGroupWithCourses)}
          />
        </div>
      </div>
    );
  }

  // Detail view - Selected course group
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Breadcrumb
          items={[
            { label: "All Courses", onClick: () => setSelectedGroup(null) },
            { label: selectedGroup.name, isActive: true },
          ]}
        />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedGroup.name}</h1>
              <p className="text-gray-600 mt-2">
                {selectedGroup.description || "Select a course to begin"}
              </p>
            </div>
          </div>
        </div>

        {/* Course Detail Content */}
        <CourseGroupDetail courses={selectedGroup.courses} />
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
