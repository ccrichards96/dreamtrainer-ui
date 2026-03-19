import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useExpertDashboardContext } from "../../../contexts";
import { updateCourse } from "../../../services/api/modules";

export default function WelcomeVideo() {
  const { course } = useExpertDashboardContext();
  const [url, setUrl] = useState(course?.welcomeVideoUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(course?.welcomeVideoUrl ?? "");
  }, [course?.welcomeVideoUrl]);

  const handleSave = async () => {
    if (!course) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateCourse(course.id, { welcomeVideoUrl: url || null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save welcome video");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="welcome-video-url" className="block text-sm font-bold text-gray-900">
            Welcome Video URL
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Add a welcome video to introduce your course to prospective students.
          </p>
        </div>

        <input
          type="url"
          id="welcome-video-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="size-4" />
            Welcome video saved successfully
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
  );
}
