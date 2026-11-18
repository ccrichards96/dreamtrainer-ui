import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthContext, useRole } from "../contexts";
import AvatarDropdown from "./AvatarDropdown";
import { useEffect, useState } from "react";
import { Play, Menu, X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

interface NavItem {
  label: string;
  to: string;
  /** Only highlight on an exact path match (e.g. so /courses/:slug/dashboard doesn't light up Courses). */
  end?: boolean;
}

// Storyblok pages, served through CMSRoute at /site/<slug>
const BECOME_LINKS: NavItem[] = [
  { label: "Become a Dream Trainer", to: "/site/become-a-dream-trainer" },
  { label: "Become a Dream Destination", to: "/site/become-a-dream-destination" },
];

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
    isActive ? "bg-[#c5a8de] text-white" : "bg-purple-50 text-gray-800 hover:bg-purple-100"
  }`;

const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-3 rounded-md text-base font-medium ${
    isActive
      ? "bg-purple-50 text-purple-900"
      : "text-gray-800 hover:text-[#c5a8de] hover:bg-purple-50"
  }`;

export default function Navigation() {
  const { isAuthenticated, login } = useAuthContext();
  const { activeRole, goToRoleHome } = useRole();
  const { loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [lastCourseSlug, setLastCourseSlug] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLastCourseSlug(localStorage.getItem("last_course_slug"));
  }, [location.pathname]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Students only get a dashboard once they've started a course; other roles always have one
  const showDashboardButton = activeRole !== "student" || !!lastCourseSlug;

  const navItems: NavItem[] = [
    { label: "Home", to: "/", end: true },
    { label: "Courses", to: "/courses", end: true },
    ...BECOME_LINKS,
    // Offers require an account
    ...(isAuthenticated ? [{ label: "Offers", to: "/offers" }] : []),
    { label: "Contact Us", to: "/site/contact-us" },
  ];

  const signUp = () => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/100 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-black">
                  Dream Trainer
                </span>
              </Link>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={desktopLinkClass}>
                  {item.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <>
                  {showDashboardButton && (
                    <button
                      onClick={() => goToRoleHome(activeRole)}
                      className="ml-2 flex items-center gap-1.5 bg-purple-950 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-purple-900 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Dashboard
                    </button>
                  )}
                  <AvatarDropdown />
                </>
              ) : (
                <>
                  <button
                    onClick={() => login()}
                    className="ml-2 text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={signUp}
                    className="bg-[#c5a8de] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b399d6] border border-[#c5a8de]"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile / tablet: avatar (if authed) + hamburger */}
            <div className="flex lg:hidden items-center space-x-2">
              {isAuthenticated && <AvatarDropdown />}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 rounded-md text-gray-700 hover:text-[#c5a8de]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Side drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[calc(100vw-3rem)] max-w-[18rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 flex-shrink-0">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-3 rounded-md text-gray-500 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col px-4 py-6 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={drawerLinkClass}>
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            showDashboardButton && (
              <button
                onClick={() => goToRoleHome(activeRole)}
                className="flex items-center gap-2 bg-purple-950 text-white px-3 py-3 rounded-md text-base font-medium hover:bg-purple-900 transition-colors mt-2"
              >
                <Play className="w-4 h-4" />
                Dashboard
              </button>
            )
          ) : (
            <div className="pt-4 space-y-2">
              <button
                onClick={() => login()}
                className="w-full text-center text-gray-800 hover:text-[#c5a8de] border border-gray-200 hover:border-[#c5a8de] px-3 py-3 rounded-md text-base font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={signUp}
                className="w-full bg-[#c5a8de] text-white px-3 py-3 rounded-md text-base font-medium hover:bg-[#b399d6] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
