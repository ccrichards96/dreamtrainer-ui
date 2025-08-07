import { useState } from 'react';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { OnboardingData } from './index';
import ProgressIndicator from './ProgressIndicator';

interface ProficiencyLevelProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const proficiencyLevels = [
  {
    value: 'beginner',
    label: 'Beginner (A1-A2)',
    description: 'I can understand basic phrases and simple conversations'
  },
  {
    value: 'intermediate',
    label: 'Intermediate (B1-B2)',
    description: 'I can handle most everyday situations and express opinions'
  },
  {
    value: 'advanced',
    label: 'Advanced (C1-C2)',
    description: 'I can understand complex texts and express myself fluently'
  },
  {
    value: 'native',
    label: 'Native/Near-Native',
    description: 'English is my first language or I speak at a native level'
  }
];

export default function ProficiencyLevel({ data, updateData, onNext, onPrev, currentStep = 2, totalSteps = 3 }: ProficiencyLevelProps) {
  const [selectedLevel, setSelectedLevel] = useState(data.englishProficiency || '');

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    updateData({ englishProficiency: level });
  };

  const handleNext = () => {
    if (selectedLevel) {
      onNext();
    }
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Your English Level?</h2>
        <p className="text-lg text-gray-600">
          This helps us personalize your learning experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 mb-8">
        {proficiencyLevels.map((level) => (
          <div
            key={level.value}
            onClick={() => handleLevelSelect(level.value)}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedLevel === level.value
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  selectedLevel === level.value ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {level.label}
                </h3>
                <p className={`text-sm ${
                  selectedLevel === level.value ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {level.description}
                </p>
              </div>
              
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                selectedLevel === level.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedLevel === level.value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
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
          disabled={!selectedLevel}
          className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          Continue
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
