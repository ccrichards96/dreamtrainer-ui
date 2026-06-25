import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Tag, Users, GraduationCap, HelpCircle } from "lucide-react";
import DashboardLayout, { type SidebarItem } from "../expert-dashboard/DashboardLayout";

export type PartnerTab = "dashboard" | "offers" | "applicants" | "cohorts" | "support";

export const partnerNavItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "applicants", label: "Applicants", icon: Users },
  { id: "cohorts", label: "Cohorts", icon: GraduationCap },
  { id: "support", label: "Support", icon: HelpCircle },
];

interface PartnerShellProps {
  /** Sidebar item to highlight as active */
  activeTab: PartnerTab;
  children: React.ReactNode;
}

/**
 * Shared layout for all partner dashboard screens — renders the sidebar and
 * routes tab clicks back to the dashboard tabs. Detail pages (e.g. offer
 * editor) reuse this so the sidebar stays consistent.
 */
export default function PartnerShell({ activeTab, children }: PartnerShellProps) {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      items={partnerNavItems}
      activeTab={activeTab}
      onTabChange={(id) => navigate(`/partner/dashboard/${id}`)}
      title="Partner Dashboard"
      breadcrumbRoot="Partner Dashboard"
    >
      {children}
    </DashboardLayout>
  );
}
