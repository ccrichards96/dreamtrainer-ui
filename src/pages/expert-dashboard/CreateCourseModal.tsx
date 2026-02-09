import { useState } from "react";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import Modal from "../../components/modals/Modal";

interface CourseFormData {
  title: string;
  category: string;
  [key: string]: string;
}

interface WizardStep {
  id: string;
  label: string;
  render: (
    value: string,
    onChange: (value: string) => void,
    error?: string
  ) => React.ReactNode;
  validate: (value: string) => string | null;
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
}

const courseCategories = [
  "Business & Entrepreneurship",
  "Design & Creative",
  "Health & Wellness",
  "Marketing & Sales",
  "Personal Development",
  "Technology & Engineering",
  "Other",
];

const steps: WizardStep[] = [
  {
    id: "title",
    label: "Course Title",
    validate: (value) =>
      value.trim().length < 3 ? "Course title must be at least 3 characters." : null,
    render: (value, onChange, error) => (
      <div>
        <label htmlFor="course-title" className="block text-sm font-medium text-gray-700 mb-1">
          What will you call your course?
        </label>
        <input
          id="course-title"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. How to Start a Successful Online Business"
          className={`w-full py-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? "border-red-300" : "border-gray-200"
          }`}
          autoFocus
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    ),
  },
  {
    id: "description",
    label: "Description",
    validate: (value) =>
      value.trim().length < 10 ? "Description must be at least 10 characters." : null,
    render: (value, onChange, error) => (
      <div>
        <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-1">
          Describe what students will learn
        </label>
        <textarea
          id="course-description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Give a brief overview of your course content and what students can expect to learn..."
          rows={5}
          className={`w-full py-3 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
            error ? "border-red-300" : "border-gray-200"
          }`}
          autoFocus
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    ),
  },
  {
    id: "category",
    label: "Category",
    validate: (value) => (!value ? "Please select a category." : null),
    render: (value, onChange, error) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose a category for your course
        </label>
        <div className="space-y-2">
          {courseCategories.map((category) => (
            <label
              key={category}
              className={`flex items-center gap-x-3 p-3 border rounded-lg cursor-pointer transition ${
                value === category
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={value === category}
                onChange={(e) => onChange(e.target.value)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-800">{category}</span>
            </label>
          ))}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    ),
  },
];

export default function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CourseFormData>({ title: "", description: "", category: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [step.id]: value }));
    setErrors((prev) => ({ ...prev, [step.id]: "" }));
  };

  const validateCurrentStep = (): boolean => {
    const error = step.validate(formData[step.id] || "");
    if (error) {
      setErrors((prev) => ({ ...prev, [step.id]: error }));
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      setSubmitting(true);
      try {
        await onSubmit(formData);
        handleReset();
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({ title: "", description: "", category: "" });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a New Course" size="md">
      <div className="p-6">
        {/* Step indicator */}
        <div className="flex items-center gap-x-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-x-2">
              <div
                className={`flex items-center justify-center size-7 rounded-full text-xs font-medium ${
                  i === currentStep
                    ? "bg-purple-600 text-white"
                    : i < currentStep
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm ${
                  i === currentStep ? "font-medium text-gray-800" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <ChevronRight className="size-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {step.render(formData[step.id] || "", handleChange, errors[step.id])}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div>
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="py-2 px-4 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="py-2.5 px-5 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:bg-purple-700 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : isLastStep ? (
              "Create Course"
            ) : (
              <>
                Next
                <ChevronRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
