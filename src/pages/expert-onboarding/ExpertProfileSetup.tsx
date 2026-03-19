import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { OnboardingExpertData } from "./index";
import ProgressIndicator from "./ProgressIndicator";
import { updateMyExpertProfile } from "../../services/api/experts";
import { updateCurrentUser } from "../../services/api/users";

interface ExpertProfileSetupProps {
  data: OnboardingExpertData;
  onBack: () => void;
  onComplete: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function ExpertProfileSetup({
  data,
  onBack,
  onComplete,
  currentStep = 2,
  totalSteps = 2,
}: ExpertProfileSetupProps) {
  const [displayName, setDisplayName] = useState(
    data.expertProfile?.displayName ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
  );
  const [bio, setBio] = useState(data.expertProfile?.bio ?? "");
  const [expertise, setExpertise] = useState(data.expertProfile?.expertise?.join(", ") ?? "");
  const [calendarLink, setCalendarLink] = useState(data.expertProfile?.calendarLink ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await updateMyExpertProfile({
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        expertise: expertise
          ? expertise
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        calendarLink: calendarLink.trim() || undefined,
      });
      await updateCurrentUser({ onboardingComplete: true });
      setLoading(false);
      setError(null);
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Set Up Your Expert Profile</h2>
        <p className="text-lg text-gray-600">
          Tell learners who you are and what you specialize in
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your public name"
            className="py-3 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            maxLength={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short biography about yourself..."
            rows={4}
            className="py-3 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-400">{bio.length}/500</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
          <input
            type="text"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g., TOEFL, IELTS, Business English"
            className="py-3 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated list</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Link</label>
          <input
            type="url"
            value={calendarLink}
            onChange={(e) => setCalendarLink(e.target.value)}
            placeholder="https://calendly.com/..."
            className="py-3 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading || success}
            className="flex-1 py-3 px-4 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!displayName.trim() || loading || success}
            className={`flex-1 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white disabled:pointer-events-none transition-colors ${
              success
                ? "bg-green-500 opacity-100"
                : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            }`}
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Setup Complete! Redirecting...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
