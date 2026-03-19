import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useExpertDashboardContext } from "../../../contexts";
import { updateCourse } from "../../../services/api/modules";

export default function CoursePageDetails() {
  const { course } = useExpertDashboardContext();
  const [imageUrl, setImageUrl] = useState(course?.imageUrl ?? "");
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState(course?.featuredVideoUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(course?.imageUrl ?? "");
    setFeaturedVideoUrl(course?.featuredVideoUrl ?? "");
  }, [course?.imageUrl, course?.featuredVideoUrl]);

  const handleSave = async () => {
    if (!course) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateCourse(course.id, {
        imageUrl: imageUrl || null,
        featuredVideoUrl: featuredVideoUrl || null,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="image-url" className="block text-sm font-bold text-gray-900">
              Course Image URL
            </label>
            <p className="mt-1 text-sm text-gray-500">Add an image URL to represent your course.</p>
          </div>

          <input
            type="url"
            id="image-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="w-full border-t border-gray-100"></div>

        <div className="space-y-4">
          <div>
            <label htmlFor="featured-video-url" className="block text-sm font-bold text-gray-900">
              Featured Video URL
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Add a featured video URL to introduce your course.
            </p>
          </div>

          <input
            type="url"
            id="featured-video-url"
            value={featuredVideoUrl}
            onChange={(e) => setFeaturedVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="pt-2">
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {success && (
            <p className="flex items-center gap-1.5 text-sm text-green-600 mb-4">
              <Check className="size-4" />
              Course details saved successfully
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="py-2.5 px-5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
