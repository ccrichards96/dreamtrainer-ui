import { useState } from "react";
import { GraduationCap, Check } from "lucide-react";
import { TeachApplicationData } from "./index";
import ProgressIndicator from "../onboarding/ProgressIndicator";

interface TeachingExperienceProps {
  data: TeachApplicationData;
  updateData: (data: Partial<TeachApplicationData>) => void;
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const experienceOptions = [
  {
    value: "online-tutor",
    label: "Online tutor",
    description: "Private or group tutoring sessions online",
  },
  {
    value: "classroom-teacher",
    label: "Classroom teacher",
    description: "Formal classroom teaching experience",
  },
  {
    value: "course-creator",
    label: "Course creator",
    description: "Created online courses or educational content",
  },
  {
    value: "workshop-leader",
    label: "Workshop / seminar leader",
    description: "Led workshops, webinars, or seminars",
  },
  {
    value: "no-experience",
    label: "No formal experience",
    description: "I'm new to teaching but eager to start",
  },
];

export default function TeachingExperience({
  data,
  updateData,
  onNext,
  currentStep = 1,
  totalSteps = 4,
}: TeachingExperienceProps) {
  const [selected, setSelected] = useState<string[]>(data.teachingExperience || []);

  const handleToggle = (value: string) => {
    let updated: string[];
    if (value === "no-experience") {
      // If selecting "no experience", deselect everything else
      updated = selected.includes(value) ? [] : [value];
    } else {
      // Remove "no experience" if selecting something else
      const filtered = selected.filter((v) => v !== "no-experience");
      updated = filtered.includes(value)
        ? filtered.filter((v) => v !== value)
        : [...filtered, value];
    }
    setSelected(updated);
    updateData({ teachingExperience: updated });
  };

  const handleNext = () => {
    if (selected.length > 0) {
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
          <GraduationCap className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What kind of teaching have you done before?
        </h2>
        <p className="text-lg text-gray-600">Select all that apply</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 mb-8">
        {experienceOptions.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <div
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isSelected ? "text-purple-900" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p className={`text-sm ${isSelected ? "text-purple-700" : "text-gray-600"}`}>
                    {option.description}
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                    isSelected ? "border-purple-500 bg-purple-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-end items-center max-w-2xl mx-auto">
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
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
