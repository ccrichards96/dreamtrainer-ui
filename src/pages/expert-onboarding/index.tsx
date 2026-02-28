import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSetup from "./ProfileSetup.tsx";
import ExpertProfileSetup from "./ExpertProfileSetup.tsx";
import { useAuthContext } from "../../contexts/useAuthContext.ts";
import { useApp } from "../../contexts/useAppContext.ts";
import { getCurrentUser } from "../../services/api/users.ts";
import type { UpdateExpertProfileDTO } from "../../types/user.ts";
import {
  acceptSupportExpertInvite,
  acceptStakeholderInvite,
} from "../../services/api/course-invites.ts";

export type OnboardingExpertData = {
  firstName?: string;
  lastName?: string;
  profileImage?: File | null;
  referralId?: string;
  expertProfile?: UpdateExpertProfileDTO;
};

export default function ExpertOnboarding() {
    const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingExpertData>({});
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const { user, isAuthenticated } = useAuthContext();
  const { refreshUserProfile } = useApp();
  const totalSteps = 2;
  
  // Accept pending invite stored in sessionStorage (set by InviteAccept before Auth0 redirect)
  useEffect(() => {
    if (!isAuthenticated) return;
    const raw = sessionStorage.getItem("pendingInvite");
    if (!raw) return;
    try {
      const { token, role } = JSON.parse(raw) as { token: string; role: string };
      const normalizedRole = role.toLowerCase().replace(/\s+/g, "-");
      if (normalizedRole === "support-expert") {
        acceptSupportExpertInvite(token).catch(console.error);
      } else if (normalizedRole === "stakeholder") {
        acceptStakeholderInvite(token).catch(console.error);
      }
    } catch (e) {
      console.error("Failed to parse pendingInvite", e);
    } finally {
      sessionStorage.removeItem("pendingInvite");
    }
  }, [isAuthenticated]);

  // Initialize onboarding data from Auth0 or existing user record
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setIsLoadingUserData(true);

        // Retrieve referralId from localStorage (set during signup)
        const referralId = localStorage.getItem("rewardful_referral_id") || undefined;

        // Check if user is authenticated with Google (social login)
        const isGoogleLogin = user?.sub?.startsWith("google-oauth2|");

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

  const updateData = (data: Partial<OnboardingExpertData>) => {
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

  const onComplete = async () => {
    await refreshUserProfile();
    navigate(`/expert/dashboard`, { replace: true });
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
                <ExpertProfileSetup
                  data={onboardingData}
                  onBack={prevStep}
                  onComplete={onComplete}
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
