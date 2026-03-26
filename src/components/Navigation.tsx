import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts";
import AvatarDropdown from "./AvatarDropdown";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navigation() {
  const { isAuthenticated, login } = useAuthContext();
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [lastCourseSlug, setLastCourseSlug] = useState<string | null>(null);
  const [lastSectionId, setLastSectionId] = useState<string | null>(null);

  // Refresh last visited course/section whenever route changes
  useEffect(() => {
    setLastCourseSlug(localStorage.getItem("last_course_slug"));
    setLastSectionId(localStorage.getItem("last_section_id"));
  }, [location.pathname]);

  const handleContinueLearning = () => {
    if (!lastCourseSlug) return;
    if (lastSectionId) {
      localStorage.setItem("selected_section_id", lastSectionId);
    }
    navigate(`/courses/${lastCourseSlug}/dashboard`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-black">Dream Trainer</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {lastCourseSlug && (
                  <button
                    onClick={handleContinueLearning}
                    className="flex items-center gap-1.5 bg-[#c5a8de] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b399d6] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                )}
                <Link
                  to="/courses"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Courses
                </Link>
                {/* <Link
                  to="/blog"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Insights
                </Link> */}
                <AvatarDropdown />
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                {/* <Link
                  to="/p/about"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  About Us
                </Link>
                <Link
                  to="/blog"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Insights
                </Link> */}
                <button
                  onClick={() => login()}
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
                  className="bg-[#c5a8de] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b399d6] border border-[#c5a8de]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
