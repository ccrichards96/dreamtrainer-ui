import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram, Youtube, Twitter, Globe, Music, User } from "lucide-react";
import type { ExpertProfile, ExpertSocialLinks } from "../types/modules";

interface ExpertProfileCardProps {
  expertProfile?: ExpertProfile | null;
}

/**
 * Get initials from a display name for avatar fallback
 */
function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

/**
 * Social link icon component
 */
function SocialLinkIcon({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors duration-200"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

/**
 * Renders social links as icon buttons
 */
function SocialLinks({ socialLinks }: { socialLinks: ExpertSocialLinks }) {
  const links: Array<{
    key: keyof ExpertSocialLinks;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { key: "twitter", icon: Twitter, label: "Twitter" },
    { key: "facebook", icon: Facebook, label: "Facebook" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "youtube", icon: Youtube, label: "YouTube" },
    { key: "tiktok", icon: Music, label: "TikTok" },
    { key: "website", icon: Globe, label: "Website" },
  ];

  const activeLinks = links.filter((link) => socialLinks[link.key]);

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {activeLinks.map((link) => (
        <SocialLinkIcon
          key={link.key}
          href={socialLinks[link.key]!}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </div>
  );
}

/**
 * Expert Profile Card - displays instructor information
 * Renders nothing if expertProfile is null/undefined
 */
export default function ExpertProfileCard({ expertProfile }: ExpertProfileCardProps) {
  if (!expertProfile) {
    return null;
  }

  const { displayName, bio, avatarUrl, socialLinks, slug } = expertProfile;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Your Instructor
      </h3>

      <Link
        to={`/experts/${slug}`}
        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-2 border-purple-100">
              {displayName ? (
                <span className="text-white font-bold text-lg">{getInitials(displayName)}</span>
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate hover:text-purple-600 transition-colors">
            {displayName}
          </h4>
        </div>
      </Link>

      {/* Bio - outside the link */}
      {bio && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{bio}</p>}

      {socialLinks && <SocialLinks socialLinks={socialLinks} />}
    </div>
  );
}
