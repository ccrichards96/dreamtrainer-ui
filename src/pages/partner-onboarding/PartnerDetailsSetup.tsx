import { useRef, useState } from "react";
import WizardHeader from "./WizardHeader";
import { StepProps } from "./types";

export default function PartnerDetailsSetup({ data, updateData, onNext, onBack, currentStep }: StepProps) {
  const [orgNameError, setOrgNameError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateData({ logoImage: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (!data.orgName?.trim()) {
      setOrgNameError("Organization name is required");
      return;
    }
    setOrgNameError("");
    onNext();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <WizardHeader currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Organization Name</label>
            <input
              type="text"
              value={data.orgName || ""}
              onChange={(e) => {
                updateData({ orgName: e.target.value });
                if (orgNameError) setOrgNameError("");
              }}
              placeholder="Institution Name"
              className={`py-2.5 px-4 w-full bg-white border rounded-lg text-sm focus:ring-purple-500 ${
                orgNameError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500"
              }`}
              maxLength={120}
            />
            {orgNameError && <p className="mt-1 text-sm text-red-600">{orgNameError}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Organization Bio</label>
            <textarea
              value={data.orgBio || ""}
              onChange={(e) => updateData({ orgBio: e.target.value })}
              placeholder="Enter organization bio..."
              rows={4}
              className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 resize-none"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Organization Website</label>
            <input
              type="url"
              value={data.orgWebsite || ""}
              onChange={(e) => updateData({ orgWebsite: e.target.value })}
              placeholder="Website..."
              className="py-2.5 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {previewUrl && (
              <img src={previewUrl} alt="Logo preview" className="w-full h-full object-cover" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <p className="mt-3 text-xs text-gray-500 text-center max-w-[160px]">
            Only JPEG, PNGs image types are allowed & a must be no smaller than 250x250 image size.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            Upload Logo
          </button>
        </div>
      </div>

      <div className="pt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
