import { GraduationCap, Presentation, Handshake, LucideIcon } from "lucide-react";
import { DashboardRole } from "../../types/user";

interface RoleConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the badge and icon chip. */
  badgeClass: string;
}

export const roleConfig: Record<DashboardRole, RoleConfig> = {
  student: {
    label: "Student",
    description: "Continue learning in the courses you're enrolled in.",
    icon: GraduationCap,
    badgeClass: "bg-purple-100 text-purple-700",
  },
  expert: {
    label: "Expert",
    description: "Build and manage your courses, students and cohorts.",
    icon: Presentation,
    badgeClass: "bg-blue-100 text-blue-700",
  },
  partner: {
    label: "Partner",
    description: "Manage your offers, applicants and cohorts.",
    icon: Handshake,
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
};
