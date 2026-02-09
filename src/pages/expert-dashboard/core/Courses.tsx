import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LifeBuoy } from "lucide-react";
import CreateCourseModal from "../CreateCourseModal";

export default function Courses() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCourse = async (data: { title: string; description: string; category: string }) => {
    // Simulate API call to create course in Draft status
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newCourseId = crypto.randomUUID();
    console.log("Course created in Draft status:", { id: newCourseId, status: "draft", ...data });

    setShowCreateModal(false);
    navigate(`/expert/dashboard/courses/${newCourseId}/manage`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Courses</h1>

      <div className="mt-6">
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Teach Your Next Cohort with Dream Trainer
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Share your expertise with the world. Create your first course and start making an impact.
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

      <div className="mt-6">
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-x-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Get Started As An Expert</h2>
              <p className="mt-0.5 text-sm text-gray-600">We've put together insightful resources for new experts.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            <li>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium">
                How to Create Your First Engaging Course
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium">
                Best Practices for Structuring Your Content
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium">
                Tips for Marketing Your Course
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium">
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
