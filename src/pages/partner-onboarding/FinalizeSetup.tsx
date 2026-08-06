import { useState } from "react";
import { CheckCircle } from "lucide-react";
import WizardHeader from "./WizardHeader";
import { OnboardingPartnerData } from "./types";
import { updateCurrentUser, uploadAvatar } from "../../services/api/users";
import { updateMyPartnerProfile, uploadPartnerLogo } from "../../services/api/partners";

interface FinalizeSetupProps {
  data: OnboardingPartnerData;
  onBack: () => void;
  onComplete: () => void;
  currentStep: number;
}

export default function FinalizeSetup({ data, onBack, onComplete, currentStep }: FinalizeSetupProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (data.profileImage) {
        await uploadAvatar(data.profileImage);
      }

      // Upload the logo first (if a new one was chosen) so its URL can be
      // included in the same profile update — the upload endpoint itself
      // doesn't persist it.
      const logoUrl = data.logoImage
        ? await uploadPartnerLogo(data.logoImage)
        : data.logoUrl ?? undefined;

      await updateMyPartnerProfile({
        orgName: data.orgName?.trim(),
        description: data.orgBio?.trim() || undefined,
        websiteUrl: data.orgWebsite?.trim() || undefined,
        title: data.title?.trim() || undefined,
        calendarLink: data.calendarLink?.trim() || undefined,
        bio: data.bio?.trim() || undefined,
        logoUrl,
      });

      await updateCurrentUser({
        firstName: data.firstName,
        lastName: data.lastName,
        onboardingComplete: true,
      });

      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err && "message" in err
            ? String((err as { message: unknown }).message)
            : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <WizardHeader currentStep={currentStep} />

      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review &amp; finish setup</h2>
          <p className="text-sm text-gray-500">
            Double-check the details below — we&apos;ll save everything when you complete setup.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
            <p className="text-gray-600">
              {data.firstName} {data.lastName}
              {data.title ? ` — ${data.title}` : ""}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Partner Details</h3>
            <p className="text-gray-600">{data.orgName || "—"}</p>
            {data.orgWebsite && <p className="text-gray-500">{data.orgWebsite}</p>}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Team</h3>
            {data.teamInvites.length === 0 ? (
              <p className="text-gray-500">No teammates invited yet.</p>
            ) : (
              <ul className="text-gray-600 space-y-0.5">
                {data.teamInvites.map((invite) => (
                  <li key={invite.email}>
                    {invite.firstName} {invite.lastName} — {invite.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading || success}
            className="py-2.5 px-6 text-sm font-semibold rounded-lg bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success}
            className={`inline-flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-semibold rounded-lg text-white disabled:pointer-events-none transition-colors ${
              success ? "bg-green-500 opacity-100" : "bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            }`}
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Setup Complete! Redirecting...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
