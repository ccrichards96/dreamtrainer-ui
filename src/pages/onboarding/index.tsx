import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSetup from "./ProfileSetup.tsx";
import ProficiencyLevel from "./ProficiencyLevel.tsx";
import PricingSelection from "./PricingSelection.tsx";
import { useAuthContext } from "../../contexts/useAuthContext";
import { getCurrentUser } from "../../services/api/users";

export type OnboardingData = {
  firstName?: string;
  lastName?: string;
  profileImage?: File | null;
  howDidYouHearAboutUs?: string;
  englishProficiency?: string;
  selectedPackage?: string;
  referralId?: string;
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const { user, isAuthenticated } = useAuthContext();

  const totalSteps = 3;

  // Initialize onboarding data from Auth0 or existing user record
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setIsLoadingUserData(true);
        
        // Retrieve referralId from localStorage (set during signup)
        const referralId = localStorage.getItem("rewardful_referral_id") || undefined;
        
        // Check if user is authenticated with Google (social login)
        const isGoogleLogin = user?.sub?.startsWith('google-oauth2|');
        
        if (isGoogleLogin && user) {
          // Use Auth0 given_name and family_name for Google logins
          setOnboardingData({
            firstName: user.given_name || "",
            lastName: user.family_name || "",
            referralId,
          });
        } else {
          // For non-Google logins, fetch existing user data from backend
          try {
            const userData = await getCurrentUser();
            setOnboardingData({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              referralId,
            });
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            // If fetch fails, still set referralId
            setOnboardingData({ referralId });
          }
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    if (isAuthenticated) {
      initializeUserData();
    } else {
      setIsLoadingUserData(false);
    }
  }, [user, isAuthenticated]);

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingUserData ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        ) : (
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
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </motion.div>
          )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
