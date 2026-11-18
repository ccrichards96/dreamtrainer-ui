import { useLocation } from "react-router-dom";
import { useRole } from "../../contexts/useRoleContext";
import { roleConfig } from "./roleConfig";

interface RoleBadgeProps {
  className?: string;
}

export default function RoleBadge({ className = "" }: RoleBadgeProps) {
  const { activeRole } = useRole();
  const location = useLocation();

  // Admin isn't a switchable role, but the badge should still reflect where the user is
  const isAdminView = location.pathname.startsWith("/admin");
  const label = isAdminView ? "Admin" : roleConfig[activeRole].label;
  const colorClass = isAdminView ? "bg-gray-900 text-white" : roleConfig[activeRole].badgeClass;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass} ${className}`}
      title={`Viewing as ${label}`}
    >
      {label}
    </span>
  );
}
