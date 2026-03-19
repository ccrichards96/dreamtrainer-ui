import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { getCourseBySlug } from "../../../services/api/modules";
import { getUserEnrollments } from "../../../services/api/enrollment";
import { AllCoursesView } from "../../explore/AllCoursesView";
import type { Course } from "../../../types/modules";
import type { CourseEnrollment } from "../../../types/enrollment";

const PLATFORM_COURSE_SLUG = "launch-your-course";

export default function GettingStarted() {
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseResponse, enrollmentsData] = await Promise.all([
          getCourseBySlug(PLATFORM_COURSE_SLUG),
          getUserEnrollments(),
        ]);
        setCourse(courseResponse.data ?? null);
        setEnrollments(enrollmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Getting Started</h1>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center gap-3 py-12">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="text-gray-600">Loading course...</span>
            </div>
          ) : error || !course ? (
            <div className="flex items-center gap-3 py-12 text-red-500">
              <AlertCircle className="w-6 h-6" />
              <span>{error ?? "Course not found"}</span>
            </div>
          ) : (
            <AllCoursesView courses={[course]} enrollments={enrollments} />
          )}
        </div>
      </div>
    </>
  );
}
