import { useState } from "react";
import { ChevronLeft, FileText } from "lucide-react";
import { TeachApplicationData } from "./index";
import ProgressIndicator from "../onboarding/ProgressIndicator";

interface ContentReadinessProps {
  data: TeachApplicationData;
  updateData: (data: Partial<TeachApplicationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const contentOptions = [
  {
    value: "ready",
    label: "Yes, I have content ready to publish",
    description: "I have existing course materials, slides, or recordings",
  },
  {
    value: "developing",
    label: "I'm currently developing content",
    description: "I'm in the process of creating course materials",
  },
  {
    value: "from-scratch",
    label: "I need to create content from scratch",
    description: "I have expertise but haven't started building content yet",
  },
];

const videoOptions = [
  {
    value: "very-comfortable",
    label: "Very comfortable",
    description: "I regularly create video content",
  },
  {
    value: "some-experience",
    label: "Some experience",
    description: "I've made a few videos before",
  },
  {
    value: "new-to-video",
    label: "New to video",
    description: "I'd like guidance getting started",
  },
];

export default function ContentReadiness({
  data,
  updateData,
  onNext,
  onPrev,
  currentStep = 2,
  totalSteps = 4,
}: ContentReadinessProps) {
  const [contentReadiness, setContentReadiness] = useState(data.contentReadiness || "");
  const [videoFamiliarity, setVideoFamiliarity] = useState(data.videoFamiliarity || "");

  const handleContentSelect = (value: string) => {
    setContentReadiness(value);
    updateData({ contentReadiness: value });
  };

  const handleVideoSelect = (value: string) => {
    setVideoFamiliarity(value);
    updateData({ videoFamiliarity: value });
  };

  const handleNext = () => {
    if (contentReadiness && videoFamiliarity) {
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
          <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Content & Video
        </h2>
        <p className="text-lg text-gray-600">
          Tell us about your content and video experience
        </p>
      </div>

      {/* Question 1: Content Readiness */}
      <div className="max-w-2xl mx-auto mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Do you have existing course content?
        </h3>
        <div className="space-y-3">
          {contentOptions.map((option) => {
            const isSelected = contentReadiness === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleContentSelect(option.value)}
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
                    <p
                      className={`text-sm ${
                        isSelected ? "text-purple-700" : "text-gray-600"
                      }`}
                    >
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

      {/* Question 2: Video Familiarity */}
      <div className="max-w-2xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How comfortable are you with video?
        </h3>
        <div className="space-y-3">
          {videoOptions.map((option) => {
            const isSelected = videoFamiliarity === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleVideoSelect(option.value)}
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
                    <p
                      className={`text-sm ${
                        isSelected ? "text-purple-700" : "text-gray-600"
                      }`}
                    >
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
          disabled={!contentReadiness || !videoFamiliarity}
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
