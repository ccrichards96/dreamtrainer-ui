import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import { useAuthContext } from "../contexts";
import { useApp } from "../contexts/useAppContext";
import { useImpersonationContext } from "../contexts/useImpersonationContext";
import { Role } from "../types/user";

interface AvatarDropdownProps {
  className?: string;
}

export default function AvatarDropdown({ className = "" }: AvatarDropdownProps) {
  const { user, logout, isImpersonating } = useAuthContext();
  const { userProfile } = useApp();
  const { returnToAdmin } = useImpersonationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Get first name only for button display
  const getFirstName = (name?: string) => {
    if (!name) return "User";
    return name.split(" ")[0];
  };

  // `userProfile` is fetched under the active token (impersonated when impersonating),
  // so it's the freshest source; `user` from AuthContext is already impersonation-aware.
  const profileName = userProfile
    ? `${userProfile.firstName ?? ""} ${userProfile.lastName ?? ""}`.trim()
    : "";
  const email = userProfile?.email || user?.email;
  const displayName = profileName || user?.name || email || "User";
  const firstName = getFirstName(profileName || user?.name || email);
  const avatarUrl = userProfile?.avatarUrl || user?.picture;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c5a8de] hover:ring-2 hover:ring-[#c5a8de] transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          {avatarUrl ? (
            <img
              className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
              src={avatarUrl}
              alt={getInitials(displayName)}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#c5a8de] flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-200 select-none">
              <span className="leading-none">{getInitials(displayName)}</span>
            </div>
          )}
        </div>
        <span className="hidden sm:block text-gray-700 font-medium max-w-32 truncate">
          {firstName}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              {isImpersonating && (
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  <UserCog className="h-3 w-3 flex-shrink-0" />
                  Viewing as
                </p>
              )}
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              {email && <p className="text-sm text-gray-500 truncate">{email}</p>}
            </div>

            {/* Menu Items */}
            <Link
              to="/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              My Account
            </Link>

            {/* Expert Dashboard - Only show for users with an expert profile */}
            {userProfile?.expertProfile && (
              <Link
                to="/expert/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Expert Dashboard
              </Link>
            )}

            {/* Admin Link - Only show for admin users */}
            {userProfile?.role === Role.Admin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* While impersonating, ending the session returns the admin to their own
                account rather than signing them out of Auth0 entirely. */}
            {isImpersonating ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  returnToAdmin();
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
              >
                Return to Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
