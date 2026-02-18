import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LifeBuoy, Settings, ImageIcon } from "lucide-react";
import CreateCourseModal from "../CreateCourseModal";
import { useExpertDashboardContext } from "../../../contexts/useExpertDashboardContext";
import { CourseStatus } from "../../../types/modules";

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  [CourseStatus.DRAFT]: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  [CourseStatus.PENDING_REVIEW]: {
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-700",
  },
  [CourseStatus.PUBLISHED]: { label: "Published", className: "bg-green-100 text-green-700" },
  [CourseStatus.ARCHIVED]: { label: "Archived", className: "bg-red-100 text-red-700" },
};

export default function Courses() {
  const navigate = useNavigate();
  const { expertProfile } = useExpertDashboardContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const assignedCourses = expertProfile?.assignedCourses ?? [];

  const handleCreateCourse = async (data: {
    title: string;
    description: string;
    category: string;
  }) => {
    // Simulate API call to create course in Draft status
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newCourseId = crypto.randomUUID();
    console.log("Course created in Draft status:", { id: newCourseId, status: "draft", ...data });

    setShowCreateModal(false);
    navigate(`/expert/dashboard/courses/${newCourseId}/manage`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
        >
          <Plus className="shrink-0 size-4" />
          New Course
        </button>
      </div>

      {assignedCourses.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedCourses.map(({ role, course }) => {
            const status = statusConfig[course.status] ?? statusConfig[CourseStatus.DRAFT];
            return (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:border-purple-300 transition group"
              >
                {/* Course Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-10 text-gray-300" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 truncate group-hover:text-purple-700 transition-colors">
                    {course.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {course.description || "No description yet"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{role}</span>
                    <button
                      onClick={() => navigate(`/expert/dashboard/courses/${course.id}/manage`)}
                      className="inline-flex items-center gap-x-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <Settings className="size-3.5" />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Teach Your Next Cohort with Dream Trainer
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Share your expertise with the world. Create your first course and start making an
                impact.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="shrink-0 py-3 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
            >
              <Plus className="shrink-0 size-4" />
              Create Your Course
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-x-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Get Started As An Expert</h2>
              <p className="mt-0.5 text-sm text-gray-600">
                We've put together insightful resources for new experts.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                How to Create Your First Engaging Course
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                Best Practices for Structuring Your Content
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                Tips for Marketing Your Course
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
              >
                Activate Your Course Marketing Engine with Webinars & Video
              </a>
            </li>
          </ul>
        </div>
      </div>
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
}
