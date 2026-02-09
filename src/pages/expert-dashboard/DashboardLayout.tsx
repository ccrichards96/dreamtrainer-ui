import { useState } from "react";
import { PanelLeft, type LucideIcon } from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

interface DashboardLayoutProps {
  items?: SidebarItem[];
  sections?: SidebarSection[];
  activeTab: string;
  onTabChange: (id: string) => void;
  title: string;
  breadcrumbRoot: string;
  sidebarHeader?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({
  items,
  sections,
  activeTab,
  onTabChange,
  title,
  breadcrumbRoot,
  sidebarHeader,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive active label from items or sections
  const allItems = items ?? sections?.flatMap((s) => s.items) ?? [];
  const activeLabel = allItems.find((item) => item.id === activeTab)?.label ?? "";

  const renderNavItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => {
            onTabChange(item.id);
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg
            ${isActive
              ? "bg-white/10 text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
        >
          <Icon className="shrink-0 size-4" />
          {item.label}
        </button>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white pt-16">
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
              {breadcrumbRoot}
              <svg className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
        className={`fixed inset-y-0 start-0 z-60 w-60 h-full bg-purple-950 transition-transform duration-300 transform pt-16
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block lg:z-30`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Optional header (back link, badges, etc.) */}
          {sidebarHeader}

          {/* Title */}
          <div className="px-5 pt-3 pb-2">
            <span className="text-xl font-semibold text-white">{title}</span>
          </div>

          {/* Navigation */}
          <div className="h-full overflow-y-auto mt-2">
            <nav className="px-3 w-full">
              {/* Flat items (no sections) */}
              {items && (
                <ul className="flex flex-col space-y-1">
                  {items.map(renderNavItem)}
                </ul>
              )}

              {/* Grouped sections */}
              {sections?.map((section) => (
                <div key={section.id} className="mb-4">
                  <p className="px-2.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map(renderNavItem)}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:ps-80 py-6">
        {children}
      </div>
    </div>
  );
}
