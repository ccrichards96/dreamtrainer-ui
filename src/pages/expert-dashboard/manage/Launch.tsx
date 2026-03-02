import { useState } from "react";
import { Rocket } from "lucide-react";
import { useParams } from "react-router-dom";
import { useExpertDashboardContext } from "../../../contexts";
import { updateCourse } from "../../../services/api/modules";
import { CourseStatus } from "../../../types/modules";

export default function Launch() {
  const { id: courseId } = useParams<{ id: string }>();
  const { course, loadCourse } = useExpertDashboardContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPendingReview = course?.status === CourseStatus.PENDING_REVIEW;
  const isPublished = course?.status === CourseStatus.PUBLISHED;

  const handleSubmit = async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      await updateCourse(courseId, { status: CourseStatus.PENDING_REVIEW });
      await loadCourse(courseId);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <p className="text-gray-600 mb-6">Publish and launch your course to students.</p>

        {isPendingReview && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            Your course is currently under review by the Dream Trainer team.
          </div>
        )}

        {isPublished && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            Your course is published and live for students.
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          disabled={isPendingReview || isPublished}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Rocket className="size-4" />
          Submit for Review
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6 mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Submit for Review</h2>
            <p className="text-sm text-gray-600 mb-6">
              This will send your course to the Dream Trainer team to review before publishing for public audiences.
            </p>

            {error && (
              <p className="mb-4 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
