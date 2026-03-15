import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Linkedin, Globe, Music, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import type { ExpertProfile, ExpertSocialLinks } from "../../types/modules";
import { updateMyExpertProfile } from "../../services/api/experts";

export interface ExpertProfileTabHandle {
  save: () => Promise<void>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

interface ExpertProfileTabProps {
  expertProfile: ExpertProfile;
  onProfileUpdated?: () => void;
  onStateChange?: (state: { hasUnsavedChanges: boolean; isSaving: boolean }) => void;
}

const SOCIAL_FIELDS: {
  key: keyof ExpertSocialLinks;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    placeholder: "https://linkedin.com/in/...",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    icon: <Twitter className="w-4 h-4" />,
    placeholder: "https://x.com/...",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    placeholder: "https://facebook.com/...",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    placeholder: "https://instagram.com/...",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: <Youtube className="w-4 h-4" />,
    placeholder: "https://youtube.com/@...",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: <Music className="w-4 h-4" />,
    placeholder: "https://tiktok.com/@...",
  },
  {
    key: "website",
    label: "Website",
    icon: <Globe className="w-4 h-4" />,
    placeholder: "https://yoursite.com",
  },
];

const ExpertProfileTab = forwardRef<ExpertProfileTabHandle, ExpertProfileTabProps>(
  ({ expertProfile, onProfileUpdated, onStateChange }, ref) => {
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [displayName, setDisplayName] = useState(expertProfile.displayName || "");
    const [bio, setBio] = useState(expertProfile.bio || "");
    const [expertise, setExpertise] = useState(
      expertProfile.expertise ? Object.values(expertProfile.expertise).join(", ") : ""
    );
    const [calendarLink, setCalendarLink] = useState(expertProfile.calendarLink || "");
    const [socialLinks, setSocialLinks] = useState<ExpertSocialLinks>(
      expertProfile.socialLinks || {}
    );

    // Track unsaved changes
    useEffect(() => {
      const expertiseStr = expertProfile.expertise
        ? Object.values(expertProfile.expertise).join(", ")
        : "";

      const hasChanges =
        displayName !== (expertProfile.displayName || "") ||
        bio !== (expertProfile.bio || "") ||
        expertise !== expertiseStr ||
        calendarLink !== (expertProfile.calendarLink || "") ||
        JSON.stringify(socialLinks) !== JSON.stringify(expertProfile.socialLinks || {});

      setHasUnsavedChanges(hasChanges);
    }, [displayName, bio, expertise, calendarLink, socialLinks, expertProfile]);

    // Notify parent of state changes so the save button re-renders
    useEffect(() => {
      onStateChange?.({ hasUnsavedChanges, isSaving });
    }, [hasUnsavedChanges, isSaving, onStateChange]);

    const handleSocialLinkChange = (key: keyof ExpertSocialLinks, value: string) => {
      setSocialLinks((prev) => ({
        ...prev,
        [key]: value || undefined,
      }));
    };

    const handleSave = async () => {
      if (!displayName.trim()) return;
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      try {
        await updateMyExpertProfile({
          displayName: displayName.trim(),
          bio: bio.trim() || undefined,
          expertise: expertise
            ? expertise
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
          calendarLink: calendarLink.trim() || undefined,
          socialLinks,
        });
        setSuccess(true);
        setHasUnsavedChanges(false);
        onProfileUpdated?.();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to update profile. Please try again.");
      } finally {
        setIsSaving(false);
      }
    };

    // Expose save, hasUnsavedChanges, and isSaving to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        save: handleSave,
        hasUnsavedChanges,
        isSaving,
      }),
      [handleSave, hasUnsavedChanges, isSaving]
    );

    return (
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            Profile updated successfully!
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your public name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short biography about yourself..."
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 resize-none"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-400">{bio.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g., TOEFL, IELTS, Business English"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-400">Comma-separated list</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Link</label>
              <input
                type="url"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                placeholder="https://calendly.com/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Enrolled students will see a "Book a Session" button on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
          <div className="space-y-4">
            {SOCIAL_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  {field.icon}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="url"
                    value={socialLinks[field.key] || ""}
                    onChange={(e) => handleSocialLinkChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ExpertProfileTab.displayName = "ExpertProfileTab";

export default ExpertProfileTab;
