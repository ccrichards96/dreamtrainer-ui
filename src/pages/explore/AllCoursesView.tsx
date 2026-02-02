import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Play } from "lucide-react";
import type { Course } from "../../types/modules";
import type { CourseEnrollment } from "../../types/enrollment";

interface AllCoursesViewProps {
  courses: Course[];
  enrollments?: CourseEnrollment[];
}

export const AllCoursesView = ({ courses, enrollments = [] }: AllCoursesViewProps) => {
  const navigate = useNavigate();

  // Create a Set of enrolled course IDs for quick lookup
  // An enrollment exists if it has a courseId and is not deleted
  const enrolledCourseIds = new Set(
    enrollments
      .filter((e) => e.courseId && !e.deletedAt)
      .map((e) => e.courseId)
  );

  const handleCourseClick = (course: Course) => {
    if (enrolledCourseIds.has(course.id)) {
      // User is enrolled - go directly to dashboard
      navigate(`/courses/${course.id}/dashboard`);
    } else {
      // Not enrolled - go to course profile page
      navigate(`/courses/${course.slug}`);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No courses found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course, index) => {
        const isEnrolled = enrolledCourseIds.has(course.id);

        return (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer min-h-[300px] animate-in slide-in-from-bottom-4 fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left side - Image with overlay */}
              <div className="relative md:w-72 h-52 md:min-h-[300px] bg-gradient-to-br from-[#c5a8de] to-[#b399d6] flex-shrink-0">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white opacity-20">
                      <BookOpen className="w-32 h-32" />
                    </div>
                  </div>
                )}
                {/* Enrolled badge */}
                {isEnrolled && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-blue-700 text-white text-xs font-semibold rounded-full">
                    Enrolled
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                {/* Title and subtitle */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h2>
                  <p className="text-sm text-gray-600">
                    {course.description || "A comprehensive course to master your skills"}
                  </p>
                </div>

                {/* Badge and Button row */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {course.numberOfSections ?? 0} Section
                    {(course.numberOfSections ?? 0) !== 1 ? "s" : ""}
                  </span>
                  {isEnrolled ? (
                    <button className="px-8 py-3 bg-purple-600 text-white text-base font-medium rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2">
                      Continue Course
                      <Play className="w-5 h-5" />
                    </button>
                  ) : (
                    <button className="px-8 py-3 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2">
                      View Course
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
