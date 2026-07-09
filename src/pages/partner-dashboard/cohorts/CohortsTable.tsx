import { Cohort, CohortStatus } from "../../../types/cohorts";
import CohortRow from "./CohortRow";

interface CohortsTableProps {
  cohorts: Cohort[];
  isLoading: boolean;
  error: string | null;
  onStatusChange: (cohort: Cohort, status: CohortStatus) => void;
  onEdit: (cohort: Cohort) => void;
  onManageMembers: (cohort: Cohort) => void;
  onDelete: (cohort: Cohort) => void;
}

const columns = ["Created At", "Name", "# of Applicants", "Status", "Actions"];

export default function CohortsTable({
  cohorts,
  isLoading,
  error,
  onStatusChange,
  onEdit,
  onManageMembers,
  onDelete,
}: CohortsTableProps) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[160px] items-center justify-center">
          <p className="text-sm text-gray-500">Loading cohorts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex min-h-[160px] items-center justify-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      );
    }

    if (cohorts.length === 0) {
      return (
        <div className="flex min-h-[160px] items-center justify-center">
          <p className="text-sm text-gray-500">No cohorts found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {cohorts.map((cohort) => (
          <CohortRow
            key={cohort.id}
            cohort={cohort}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onManageMembers={onManageMembers}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[110px_1.5fr_1fr_1.6fr_48px] gap-4 px-4 pb-3">
        {columns.map((column) => (
          <span key={column} className="text-sm font-medium text-gray-500">
            {column}
          </span>
        ))}
      </div>

      {renderBody()}
    </div>
  );
}
