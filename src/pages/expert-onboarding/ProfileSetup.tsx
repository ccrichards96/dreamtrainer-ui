import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { OnboardingExpertData } from "./index";
import ProgressIndicator from "./ProgressIndicator";
import { validateName, sanitizeName } from "../../utils/validation";

interface ProfileSetupProps {
  data: OnboardingExpertData;
  updateData: (data: Partial<OnboardingExpertData>) => void;
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function ProfileSetup({
  data,
  updateData,
  onNext,
  currentStep = 1,
  totalSteps = 3,
}: ProfileSetupProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateData({ profileImage: file });

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);

    // Validate the name
    const validation = validateName(value);
    if (validation.isValid) {
      setFirstNameError("");
      const sanitizedName = sanitizeName(value);
      updateData({ firstName: sanitizedName });
    } else {
      setFirstNameError(validation.error || "Invalid name");
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);

    // Validate the name
    const validation = validateName(value);
    if (validation.isValid) {
      setLastNameError("");
      const sanitizedName = sanitizeName(value);
      updateData({ lastName: sanitizedName });
    } else {
      setLastNameError(validation.error || "Invalid name");
    }
  };

  const handleNext = () => {
    // Validate names before proceeding
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);

    setFirstNameError(
      firstNameValidation.isValid ? "" : firstNameValidation.error || "Invalid name"
    );
    setLastNameError(lastNameValidation.isValid ? "" : lastNameValidation.error || "Invalid name");

    if (
      firstNameValidation.isValid &&
      lastNameValidation.isValid
    ) {
      onNext();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Steps */}
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Set Up Your Expert Profile</h2>
        <p className="text-lg text-gray-600">
          Enter your first and last name, add a profile photo
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Name Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              placeholder="Enter your first name"
              className={`py-3 px-4 w-full bg-white border rounded-lg text-sm focus:ring-blue-500 ${
                firstNameError
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              maxLength={50}
              required
            />
            {firstNameError && <p className="mt-1 text-sm text-red-600">{firstNameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleLastNameChange(e.target.value)}
              placeholder="Enter your last name"
              className={`py-3 px-4 w-full bg-white border rounded-lg text-sm focus:ring-blue-500 ${
                lastNameError
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              maxLength={50}
              required
            />
            {lastNameError && <p className="mt-1 text-sm text-red-600">{lastNameError}</p>}
          </div>
        </div>
        {/* Profile Image Upload */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Profile Photo (Optional)
          </label>

          <div className="relative inline-block">
            <div
              onClick={triggerFileInput}
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (max. 5MB)</p>
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <button
            onClick={handleNext}
            disabled={
              !firstName.trim() ||
              !lastName.trim()
            }
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
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
    </div>
  );
}
