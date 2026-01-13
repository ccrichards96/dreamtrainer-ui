import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { useCourseContext } from "../../contexts/useCourseContext";
import { startCourse, getUserAllProgress } from "../../services/api/course-progress";
import { getCourseSections } from "../../services/api/modules";
import type { Course, Section } from "../../types/modules";
import type { CourseProgress } from "../../types/course-progress";

interface CourseDetailProps {
  course: Course;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
  const navigate = useNavigate();
  const { loadCourse } = useCourseContext();
  const [loadingSectionId, setLoadingSectionId] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // Fetch sections for this course
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoadingSections(true);
        const sectionsData = await getCourseSections(course.id);
        // Sort sections by order field
        const sortedSections = (sectionsData || []).sort(
          (a: Section, b: Section) => a.order - b.order
        );
        setSections(sortedSections);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [course.id]);

  // Fetch user's course progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const progress = await getUserAllProgress();
        setCourseProgress(progress);
      } catch (error) {
        console.error("Failed to fetch course progress:", error);
        // Continue with empty progress if fetch fails
        setCourseProgress([]);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, []);

  const handleStartSection = async (sectionId: string) => {
    try {
      setLoadingSectionId(sectionId);

      // Check if course is already in progress
      const existingProgress = courseProgress.find((p) => p.courseId === course.id);

      if (!existingProgress || existingProgress.progressStatus === "Not Started") {
        // Start course progress tracking on the backend
        await startCourse(course.id);
      }

      // Load course data into context
      await loadCourse(course.id);

      // Save selected section to localStorage (course ID is in URL)
      localStorage.setItem("selected_section_id", sectionId);

      // Navigate to course-specific dashboard
      navigate(`/courses/${course.id}/dashboard`);
    } catch (error) {
      console.error("Failed to start section:", error);
      alert("Failed to start section. Please try again.");
    } finally {
      setLoadingSectionId(null);
    }
  };

  // Helper function to get course progress status
  const getCourseProgress = () => {
    return courseProgress.find((p) => p.courseId === course.id);
  };

  // Helper function to determine button text and style for a section
  const getButtonConfig = () => {
    const progress = getCourseProgress();

    if (!progress) {
      return {
        text: "Start Section",
        icon: <ArrowRight className="w-4 h-4" />,
        variant: "primary",
      };
    }

    if (progress.progressStatus === "Not Started" || progress.progressStatus === "In Progress") {
      return {
        text: "Continue Section",
        icon: <ArrowRight className="w-4 h-4" />,
        variant: "secondary",
        progress: progress.percentageComplete,
      };
    }

    if (progress.progressStatus === "Completed") {
      return {
        text: "Review",
        icon: <ArrowRight className="w-4 h-4" />,
        variant: "completed",
      };
    }

    return {
      text: "Start",
      icon: <ArrowRight className="w-4 h-4" />,
      variant: "primary",
    };
  };

  if (loadingSections) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#c5a8de]" />
        <span className="ml-3 text-gray-600">Loading sections...</span>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No sections found in this course</p>
      </div>
    );
  }

  const buttonConfig = getButtonConfig();

  return (
    <div className="space-y-6">
      {/* Course Progress Overview */}

      {/* Sections Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
          >
            {/* Card Image */}
            <div className="h-48 bg-gray-900 flex items-center justify-center">
              <div className="text-white text-6xl font-light opacity-20">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold text-gray-800">{section.name}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {section.description || "Start learning with this section."}
              </p>

              <div className="mt-5">
                {/* Action Button */}
                <button
                  onClick={() => handleStartSection(section.id)}
                  disabled={loadingSectionId === section.id || loadingProgress}
                  className={`w-full py-2 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 ${
                    buttonConfig.variant === "completed"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : buttonConfig.variant === "secondary"
                        ? "bg-[#7c5e99] text-white hover:bg-[#6b4d87] hover:scale-105"
                        : "bg-[#c5a8de] text-white hover:bg-[#b399d6] hover:scale-105"
                  }`}
                >
                  {loadingSectionId === section.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {buttonConfig.text}
                      {buttonConfig.icon}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
