import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { OnboardingData } from './index';
import ProgressIndicator from './ProgressIndicator';

interface ProfileSetupProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const howDidYouHearOptions = [
  { value: '', label: 'Please select...' },
  { value: 'google', label: 'Google Search' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'friend', label: 'Friend/Family Recommendation' },
  { value: 'advertisement', label: 'Online Advertisement' },
  { value: 'blog', label: 'Blog/Article' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'other', label: 'Other' }
];

export default function ProfileSetup({ data, updateData, onNext, currentStep = 1, totalSteps = 3 }: ProfileSetupProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState(
    howDidYouHearOptions.find(option => option.value === data.howDidYouHearAboutUs)?.value || 
    (data.howDidYouHearAboutUs && !howDidYouHearOptions.find(option => option.value === data.howDidYouHearAboutUs) ? 'other' : '')
  );
  const [customSource, setCustomSource] = useState(
    data.howDidYouHearAboutUs && !howDidYouHearOptions.find(option => option.value === data.howDidYouHearAboutUs) 
      ? data.howDidYouHearAboutUs 
      : ''
  );
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

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    if (value === 'other') {
      // Don't update howDidYouHearAboutUs yet, wait for custom input
      setCustomSource('');
    } else {
      // For predefined options, update immediately
      updateData({ howDidYouHearAboutUs: value });
      setCustomSource('');
    }
  };

  const handleCustomSourceChange = (value: string) => {
    setCustomSource(value);
    // Update howDidYouHearAboutUs with the custom text
    updateData({ howDidYouHearAboutUs: value });
  };

  const handleNext = () => {
    if (selectedSource && (selectedSource !== 'other' || customSource.trim())) {
      onNext();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Steps */}
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />

      {/* Content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Set Up Your Profile</h2>
        <p className="text-lg text-gray-600">
          Add a profile photo and tell us how you discovered DreamTrainer
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
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
          
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG or GIF (max. 5MB)
          </p>
        </div>

        {/* How did you hear about us */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us? *
          </label>
          
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 appearance-none"
            >
              {howDidYouHearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </div>
          </div>

          {/* Custom source input - shown when "other" is selected */}
          {selectedSource === 'other' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify: *
              </label>
              <input
                type="text"
                value={customSource}
                onChange={(e) => handleCustomSourceChange(e.target.value)}
                placeholder="How did you hear about us?"
                className="py-3 px-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                maxLength={100}
              />
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <button
            onClick={handleNext}
            disabled={!selectedSource || (selectedSource === 'other' && !customSource.trim())}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Continue
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
