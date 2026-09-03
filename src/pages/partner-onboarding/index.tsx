import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import WizardHeader from "./WizardHeader";
import ProfileSetup from "./ProfileSetup";
import PartnerDetailsSetup from "./PartnerDetailsSetup";
import FinalizeSetup from "./FinalizeSetup";
import { OnboardingPartnerData } from "./types";
import { useAuthContext } from "../../contexts/useAuthContext";
import { useApp } from "../../contexts/useAppContext";
import { getCurrentUser } from "../../services/api/users";
import { getMyPartnerProfile } from "../../services/api/partners";
import { acceptPartnerInvite, getInvitePrefillData } from "../../services/api/course-invites";

const TOTAL_STEPS = 3;

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingPartnerData>({});
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const { user, isAuthenticated } = useAuthContext();
  const { refreshUserProfile } = useApp();

  // Prefill from Auth0 or the existing user record so the partner isn't
  // retyping their name if it's already known, then layer in anything an
  // admin prefilled on the invite (if this signup came from an invite link),
  // then finally layer in anything they already saved on a previous visit to
  // the wizard — real saved profile data always wins over invite-time prefill.
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setIsLoadingUserData(true);
        const isGoogleLogin = user?.sub?.startsWith("google-oauth2|");

        if (isGoogleLogin && user) {
          setData((prev) => ({
            ...prev,
            firstName: user.given_name || "",
            lastName: user.family_name || "",
          }));
        } else {
          try {
            const userData = await getCurrentUser();
            setData((prev) => ({
              ...prev,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
            }));
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        }

        // If this signup came from a partner invite link that carries
        // admin-prefilled details, merge those in. No prefill data (or an
        // expired/used invite) is a normal case, not an error.
        const rawPendingInvite = sessionStorage.getItem("pendingInvite");
        if (rawPendingInvite) {
          try {
            const pendingInvite = JSON.parse(rawPendingInvite);
            if (pendingInvite.role === "partner" && pendingInvite.token) {
              const prefillData = await getInvitePrefillData(pendingInvite.token);
              if (prefillData) {
                setData((prev) => ({
                  ...prev,
                  firstName: prefillData.firstName || prev.firstName,
                  lastName: prefillData.lastName || prev.lastName,
                  title: prefillData.title || prev.title,
                  calendarLink: prefillData.calendarLink || prev.calendarLink,
                  bio: prefillData.bio || prev.bio,
                  orgName: prefillData.orgName || prev.orgName,
                  orgBio: prefillData.orgBio || prev.orgBio,
                  orgWebsite: prefillData.websiteUrl || prev.orgWebsite,
                }));
              }
            }
          } catch (error) {
            console.error("Failed to fetch invite prefill data:", error);
          }
        }

        // A 404 here just means this partner hasn't completed onboarding
        // before — nothing to prefill, so swallow that case quietly.
        try {
          const partnerProfile = await getMyPartnerProfile();
          setData((prev) => ({
            ...prev,
            firstName: partnerProfile.user?.firstName || prev.firstName,
            lastName: partnerProfile.user?.lastName || prev.lastName,
            title: partnerProfile.title || prev.title,
            calendarLink: partnerProfile.calendarLink || prev.calendarLink,
            bio: partnerProfile.bio || prev.bio,
            avatarUrl: partnerProfile.user?.avatarUrl,
            orgName: partnerProfile.orgName || prev.orgName,
            orgBio: partnerProfile.description || prev.orgBio,
            orgWebsite: partnerProfile.websiteUrl || prev.orgWebsite,
            logoUrl: partnerProfile.logoUrl,
          }));
        } catch (error) {
          console.error("No existing partner profile to prefill:", error);
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

  const updateData = (partial: Partial<OnboardingPartnerData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const nextStep = () => setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((step) => Math.max(step - 1, 1));

  const onComplete = async () => {
    await refreshUserProfile();

    // If this wizard was reached via a course-partner invite link, link the
    // partner to that course now that onboarding is finished, then drop them
    // on the course instead of the generic dashboard.
    const rawPendingInvite = sessionStorage.getItem("pendingInvite");
    if (rawPendingInvite) {
      try {
        const pendingInvite = JSON.parse(rawPendingInvite);
        if (pendingInvite.role === "partner" && pendingInvite.token && pendingInvite.course) {
          await acceptPartnerInvite(pendingInvite.token);
          sessionStorage.removeItem("pendingInvite");
          navigate(`/courses/${pendingInvite.course}`, { replace: true });
          return;
        }
      } catch (error) {
        console.error("Failed to accept pending partner invite:", error);
      }
      sessionStorage.removeItem("pendingInvite");
    }

    navigate("/partner/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingUserData ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <WizardHeader currentStep={1} heading="Please wait..." />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <ProfileSetup
                  data={data}
                  updateData={updateData}
                  onNext={nextStep}
                  onBack={prevStep}
                  currentStep={currentStep}
                />
              )}
              {currentStep === 2 && (
                <PartnerDetailsSetup
                  data={data}
                  updateData={updateData}
                  onNext={nextStep}
                  onBack={prevStep}
                  currentStep={currentStep}
                />
              )}
              {currentStep === 3 && (
                <FinalizeSetup
                  data={data}
                  onBack={prevStep}
                  onComplete={onComplete}
                  currentStep={currentStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
