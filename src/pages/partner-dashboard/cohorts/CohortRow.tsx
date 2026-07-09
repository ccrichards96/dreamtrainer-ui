import { Pencil, Users, Trash2 } from "lucide-react";
import { Cohort, CohortStatus } from "../../../types/cohorts";
import DropdownMenu, { DropdownMenuItem } from "../shared/DropdownMenu";
import CohortStatusControl from "./CohortStatusControl";

interface CohortRowProps {
  cohort: Cohort;
  onStatusChange: (cohort: Cohort, status: CohortStatus) => void;
  onEdit: (cohort: Cohort) => void;
  onManageMembers: (cohort: Cohort) => void;
  onDelete: (cohort: Cohort) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString("en-US");
}

export default function CohortRow({
  cohort,
  onStatusChange,
  onEdit,
  onManageMembers,
  onDelete,
}: CohortRowProps) {
  const applicantCount = cohort.members?.length ?? 0;

  const menuItems: DropdownMenuItem[] = [
    { key: "edit", label: "Edit", icon: Pencil, onSelect: () => onEdit(cohort) },
    {
      key: "members",
      label: "Manage Members",
      icon: Users,
      onSelect: () => onManageMembers(cohort),
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      destructive: true,
      onSelect: () => onDelete(cohort),
    },
  ];

  return (
    <div className="grid grid-cols-[110px_1.5fr_1fr_1.6fr_48px] items-center gap-4 rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
      {/* Created At */}
      <span className="text-sm text-gray-600">{formatDate(cohort.createdAt)}</span>

      {/* Name */}
      <span className="font-semibold text-gray-800">{cohort.name}</span>

      {/* # of Applicants */}
      <span className="text-sm text-gray-700">{applicantCount}</span>

      {/* Status */}
      <div>
        <CohortStatusControl
          status={cohort.status}
          onChange={(status) => onStatusChange(cohort, status)}
        />
      </div>

      {/* Actions */}
      <DropdownMenu items={menuItems} ariaLabel={`Actions for ${cohort.name}`} />
    </div>
  );
}
