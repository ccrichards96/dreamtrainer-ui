import { useState } from "react";
import { BookOpen, Users, Tag, Megaphone, PanelLeft } from "lucide-react";

export type AdminView =
  | "overview"
  | "course-edit"
  | "section-manage"
  | "module-manage"
  | "announcement-manage"
  | "user-manage"
  | "category-manage";

interface NavItem {
  id: AdminView;
  label: string;
  icon: React.ElementType;
}

const manageItems: NavItem[] = [
  { id: "overview", label: "Courses", icon: BookOpen },
  { id: "user-manage", label: "Users", icon: Users },
  { id: "category-manage", label: "Categories", icon: Tag },
  { id: "announcement-manage", label: "Announcements", icon: Megaphone },
];

interface AdminSidebarProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const resolvedActive = (
    ["course-edit", "section-manage", "module-manage"] as AdminView[]
  ).includes(activeView)
    ? "overview"
    : activeView;

  // Derive label for breadcrumb
  const allItems = [...manageItems];
  const activeLabel = allItems.find((i) => i.id === resolvedActive)?.label ?? "";

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = resolvedActive === item.id;
    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => {
            onNavigate(item.id);
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg ${
            isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon className="shrink-0 size-4" />
          {item.label}
        </button>
      </li>
    );
  };

  return (
    <>
      {/* Mobile breadcrumb / sidebar toggle */}
      <div className="sticky top-16 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden">
        <div className="flex items-center py-2">
          <button
            type="button"
            className="size-8 flex justify-center items-center bg-white border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle navigation"
          >
            <PanelLeft className="shrink-0 size-4" />
          </button>
          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800">
              Admin
              <svg
                className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li className="text-sm font-semibold text-gray-800 truncate" aria-current="page">
              {activeLabel}
            </li>
          </ol>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 start-0 z-60 w-60 h-full bg-gray-950 transition-transform duration-300 transform pt-16
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block lg:z-30`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Title */}
          <div className="px-5 pt-3">
            <span className="text-xl font-semibold text-white">Admin Dashboard</span>
          </div>

          {/* Navigation */}
          <div className="h-full overflow-y-auto">
            <nav className="px-3 w-full">
              {/* Manage section */}
              <div className="mt-6 mb-1.5">
                <p className="px-2.5 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Manage
                </p>
              </div>
              <ul className="space-y-0.5">{manageItems.map(renderNavItem)}</ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
