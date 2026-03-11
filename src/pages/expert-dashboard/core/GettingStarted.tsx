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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Structure</h3>
        <p className="text-gray-600">- Insert instuctions on the ideal learning structure-</p>
      </div>

      <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Course Requirements</h3>
        <ul>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Your course must pass our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              course requirements list
            </a>{" "}
            for ensuring course quality.
          </li>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Define clear learning outcomes for your course.
          </li>
          <li className="mt-3 text-gray-600 list-disc list-inside">
            Your course must have <b>at least 3 sections.</b>
          </li>
          <li className="mt-1 text-gray-600 list-disc list-inside">
            Ensure outcomes for sections are measurable and achievable.
          </li>
        </ul>
      </div>
    </>
  );
}
