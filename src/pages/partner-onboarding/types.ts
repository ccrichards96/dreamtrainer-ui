export interface TeamInvite {
  firstName: string;
  lastName: string;
  email: string;
}

// Shared state threaded through every step of the wizard. Each step only
// writes the slice it owns, via `updateData`.
export type OnboardingPartnerData = {
  // Step 1 — Profile (individual contact)
  firstName?: string;
  lastName?: string;
  title?: string;
  calendarLink?: string;
  bio?: string;
  profileImage?: File | null;
  /** Already-uploaded avatar from a previous visit to the wizard; shown as the preview until a new file is chosen. */
  avatarUrl?: string | null;

  // Step 2 — Partner Details (organization)
  orgName?: string;
  orgBio?: string;
  orgWebsite?: string;
  logoImage?: File | null;
  /** Already-uploaded logo from a previous visit to the wizard; shown as the preview until a new file is chosen. */
  logoUrl?: string | null;

  // Step 3 — Team
  teamInvites: TeamInvite[];
};

export const WIZARD_STEPS = [
  { label: "Profile" },
  { label: "Partner Details" },
  { label: "Team" },
  { label: "Finalize" },
] as const;

export interface StepProps {
  data: OnboardingPartnerData;
  updateData: (data: Partial<OnboardingPartnerData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}
