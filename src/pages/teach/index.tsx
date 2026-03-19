import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeachingExperience from "./TeachingExperience";
import ContentReadiness from "./ContentReadiness";
import AudienceReach from "./AudienceReach";
import FinalDetails from "./FinalDetails";
import { useAuthContext } from "../../contexts/useAuthContext";
import { getCurrentUser } from "../../services/api/users";

export type TeachApplicationData = {
  // Step 1
  teachingExperience: string[];
  // Step 2
  contentReadiness: string;
  videoFamiliarity: string;
  // Step 3
  audienceSize: string;
  platforms: string[];
  // Step 4
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
};

export default function TeachOnDreamTrainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<TeachApplicationData>({
    teachingExperience: [],
    contentReadiness: "",
    videoFamiliarity: "",
    audienceSize: "",
    platforms: [],
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const { user, isAuthenticated } = useAuthContext();

  const totalSteps = 4;

  // Initialize user data from Auth0 or backend
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setIsLoadingUserData(true);

        const isGoogleLogin = user?.sub?.startsWith("google-oauth2|");

        if (isGoogleLogin && user) {
          setApplicationData((prev) => ({
            ...prev,
            firstName: user.given_name || "",
            lastName: user.family_name || "",
            email: user.email || "",
          }));
        } else {
          try {
            const userData = await getCurrentUser();
            setApplicationData((prev) => ({
              ...prev,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
            }));
          } catch (error) {
            console.error("Failed to fetch user data:", error);
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

  const updateData = (data: Partial<TeachApplicationData>) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
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
                <TeachingExperience
                  data={applicationData}
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
                <ContentReadiness
                  data={applicationData}
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
                <AudienceReach
                  data={applicationData}
                  updateData={updateData}
                  onNext={nextStep}
                  onPrev={prevStep}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <FinalDetails
                  data={applicationData}
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
