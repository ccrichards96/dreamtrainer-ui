import { useEffect, useState } from "react";
import { Link, matchPath, useLocation, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Tag,
  Wand2,
  type LucideIcon,
} from "lucide-react";

interface StudentNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Route to navigate to; items without one are rendered disabled until their page exists. */
  to?: string;
  /** Route pattern used to highlight the item as active. */
  match?: string;
}

const COLLAPSED_STORAGE_KEY = "student_sidebar_collapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
}

export default function StudentDashboardLayout({ children }: StudentDashboardLayoutProps) {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
    } catch {
      // Collapse state is a convenience — ignore storage failures
    }
  }, [collapsed]);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Outside a course route, fall back to the last course the student visited
  const courseSlug = slug || localStorage.getItem("last_course_slug");

  const items: StudentNavItem[] = [
    {
      id: "start",
      label: "Start & Succeed",
      icon: Wand2,
      to: courseSlug ? `/courses/${courseSlug}/dashboard` : "/courses",
      match: "/courses/:slug/dashboard",
    },
    { id: "courses", label: "My Courses", icon: BookOpen, to: "/my-courses", match: "/my-courses" },
    {
      id: "offers",
      label: "My Offers",
      icon: Tag,
      to: "/offers/my-offers",
      match: "/offers/my-offers",
    },
  ];

  const activeItem = items.find((item) => item.match && matchPath(item.match, location.pathname));

  const renderNav = (isCollapsed: boolean) => (
    <ul className="flex flex-col space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item === activeItem;
        const itemClass = `w-full flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg transition-colors ${
          isCollapsed ? "justify-center" : ""
        }`;
        const content = (
          <>
            <Icon className="shrink-0 size-4" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </>
        );

        return (
          <li key={item.id}>
            {item.to ? (
              <Link
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`${itemClass} ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {content}
              </Link>
            ) : (
              <span
                title={`${item.label} (coming soon)`}
                aria-disabled="true"
                className={`${itemClass} text-white/40 cursor-not-allowed`}
              >
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white lg:flex">
      {/* Mobile sidebar toggle */}
      <div className="sticky top-16 z-20 flex items-center gap-3 bg-white border-y border-gray-200 px-4 py-2 lg:hidden">
        <button
          type="button"
          className="size-8 flex justify-center items-center bg-white border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none"
          onClick={() => setMobileOpen(true)}
          aria-label="Open student dashboard navigation"
        >
          <PanelLeft className="shrink-0 size-4" />
        </button>
        <span className="text-sm font-semibold text-gray-800 truncate">
          {activeItem?.label ?? "Student Dashboard"}
        </span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 start-0 z-[60] w-60 bg-purple-950 pt-16 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Student dashboard"
      >
        <div className="px-5 pt-3 pb-2">
          <span className="text-xl font-semibold text-white">Student Dashboard</span>
        </div>
        <nav className="px-3 mt-2">{renderNav(false)}</nav>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block sticky top-16 h-[calc(100vh-4rem)] shrink-0 bg-purple-950 transition-[width] duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
        aria-label="Student dashboard"
      >
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute -right-3 top-4 z-10 size-6 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:text-gray-900"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
        </button>

        <div className={`pt-3 pb-2 ${collapsed ? "px-3" : "px-5"}`}>
          {collapsed ? (
            <span className="sr-only">Student Dashboard</span>
          ) : (
            <span className="block text-xl font-semibold text-white truncate">
              Student Dashboard
            </span>
          )}
        </div>
        <nav className={`mt-2 ${collapsed ? "px-2" : "px-3"}`}>{renderNav(collapsed)}</nav>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
