import { useState } from "react";
import { ChevronLeft, Users, Check } from "lucide-react";
import { TeachApplicationData } from "./index";
import ProgressIndicator from "../onboarding/ProgressIndicator";

interface AudienceReachProps {
  data: TeachApplicationData;
  updateData: (data: Partial<TeachApplicationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const audienceSizeOptions = [
  {
    value: "none",
    label: "No audience yet",
    description: "I'm just getting started",
  },
  {
    value: "small",
    label: "Small (under 1,000 followers)",
    description: "I have a growing community",
  },
  {
    value: "medium",
    label: "Medium (1,000–10,000 followers)",
    description: "I have an established following",
  },
  {
    value: "large",
    label: "Large (10,000+ followers)",
    description: "I have a significant audience",
  },
];

const platformOptions = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "blog", label: "Blog / Website" },
  { value: "other", label: "Other" },
];

export default function AudienceReach({
  data,
  updateData,
  onNext,
  onPrev,
  currentStep = 3,
  totalSteps = 4,
}: AudienceReachProps) {
  const [audienceSize, setAudienceSize] = useState(data.audienceSize || "");
  const [platforms, setPlatforms] = useState<string[]>(data.platforms || []);

  const handleSizeSelect = (value: string) => {
    setAudienceSize(value);
    updateData({ audienceSize: value });
  };

  const handlePlatformToggle = (value: string) => {
    const updated = platforms.includes(value)
      ? platforms.filter((v) => v !== value)
      : [...platforms, value];
    setPlatforms(updated);
    updateData({ platforms: updated });
  };

  const handleNext = () => {
    if (audienceSize) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        title="Teach on DreamTrainer"
      />

      {/* Content */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Audience & Reach</h2>
        <p className="text-lg text-gray-600">Tell us about your existing audience</p>
      </div>

      {/* Question 1: Audience Size */}
      <div className="max-w-2xl mx-auto mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Do you have an existing audience?
        </h3>
        <div className="space-y-3">
          {audienceSizeOptions.map((option) => {
            const isSelected = audienceSize === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleSizeSelect(option.value)}
                className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4
                      className={`text-base font-semibold mb-1 ${
                        isSelected ? "text-purple-900" : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? "text-purple-700" : "text-gray-600"}`}>
                      {option.description}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                      isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question 2: Platforms (optional) */}
      <div className="max-w-2xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Where is your audience?</h3>
        <p className="text-sm text-gray-500 mb-4">Optional — select all that apply</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {platformOptions.map((option) => {
            const isSelected = platforms.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => handlePlatformToggle(option.value)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md text-center ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-purple-900" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <button
          onClick={onPrev}
          className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!audienceSize}
          className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Continue
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
