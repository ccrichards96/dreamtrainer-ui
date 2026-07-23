import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import WizardHeader from "./WizardHeader";
import { StepProps } from "./types";
import { validateName, sanitizeName } from "../../utils/validation";

export default function ProfileSetup({ data, updateData, onNext, currentStep }: StepProps) {
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    const validation = validateName(value);
    if (validation.isValid) {
      setFirstNameError("");
      updateData({ firstName: sanitizeName(value) });
    } else {
      setFirstNameError(validation.error || "Invalid name");
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    const validation = validateName(value);
    if (validation.isValid) {
      setLastNameError("");
      updateData({ lastName: sanitizeName(value) });
    } else {
      setLastNameError(validation.error || "Invalid name");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateData({ profileImage: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleNext = () => {
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);

    setFirstNameError(firstNameValidation.isValid ? "" : firstNameValidation.error || "Invalid name");
    setLastNameError(lastNameValidation.isValid ? "" : lastNameValidation.error || "Invalid name");

    if (firstNameValidation.isValid && lastNameValidation.isValid) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <WizardHeader currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <div>
            <label className="block text-sm text-gray-500 mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              placeholder="Enter first name..."
              className={`py-2.5 px-4 w-full bg-white border rounded-lg text-sm focus:ring-purple-500 ${
                firstNameError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500"
              }`}
              maxLength={50}
            />
            {firstNameError && <p className="mt-1 text-sm text-red-600">{firstNameError}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleLastNameChange(e.target.value)}
              placeholder="Enter last name..."
              className={`py-2.5 px-4 w-full bg-white border rounded-lg text-sm focus:ring-purple-500 ${
                lastNameError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500"
              }`}
              maxLength={50}
            />
            {lastNameError && <p className="mt-1 text-sm text-red-600">{lastNameError}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-500 mb-2">Title</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="Enter your title/role..."
              className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              maxLength={100}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-500 mb-2">Calendar Link</label>
            <input
              type="url"
              value={data.calendarLink || ""}
              onChange={(e) => updateData({ calendarLink: e.target.value })}
              placeholder="Enter calendar appointment link..."
              className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-500 mb-2">Bio (optional)</label>
            <input
              type="text"
              value={data.bio || ""}
              onChange={(e) => updateData({ bio: e.target.value })}
              placeholder="Enter a small bio about yourself..."
              className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {previewUrl && (
              <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="mt-3 text-xs text-gray-500 text-center max-w-[160px]">
            Only JPEG, PNGs image types are allowed.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Profile Picture
          </button>
        </div>
      </div>

      <div className="pt-8 flex justify-end gap-3">
        <button
          type="button"
          disabled
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-gray-400 text-white opacity-60 cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!firstName.trim() || !lastName.trim()}
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
