import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSetup from './ProfileSetup.tsx';
import ProficiencyLevel from './ProficiencyLevel.tsx';
import PricingSelection from './PricingSelection.tsx';

export type OnboardingData = {
  profileImage?: File | null;
  howDidYouHearAboutUs?: string;
  englishProficiency?: string;
  selectedPackage?: string;
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const totalSteps = 3;

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed with data:', onboardingData);
    // TODO: Submit onboarding data to API and navigate to dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSetup
                data={onboardingData}
                updateData={updateData}
                onNext={nextStep}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ProficiencyLevel
                data={onboardingData}
                updateData={updateData}
                onNext={nextStep}
                onPrev={prevStep}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <PricingSelection
                data={onboardingData}
                updateData={updateData}
                onPrev={prevStep}
                onComplete={handleComplete}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}