// Shared state threaded through every step of the wizard. Each step only
// writes the slice it owns, via `updateData`.
export type OnboardingPartnerData = {
  firstName?: string;
  lastName?: string;
  title?: string;
  calendarLink?: string;
  bio?: string;
  profileImage?: File | null;
  avatarUrl?: string | null;

  // Step 2 — Partner Details (organization)
  orgName?: string;
  orgBio?: string;
  orgWebsite?: string;
  logoImage?: File | null;
  logoUrl?: string | null;
};

export const WIZARD_STEPS = [
  { label: "Profile" },
  { label: "Partner Details" },
  { label: "Finalize" },
] as const;

export interface StepProps {
  data: OnboardingPartnerData;
  updateData: (data: Partial<OnboardingPartnerData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}
