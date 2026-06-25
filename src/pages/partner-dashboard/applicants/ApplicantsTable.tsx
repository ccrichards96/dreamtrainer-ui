import { Applicant, ApplicantAction, Cohort } from "./types";
import ApplicantRow from "./ApplicantRow";

interface ApplicantsTableProps {
  applicants: Applicant[];
  cohorts: Cohort[];
  onAssignCohort: (applicantId: string, cohortId: string) => void;
  onAction: (action: ApplicantAction, applicant: Applicant) => void;
}

const columns = ["Date", "Applicant", "Bio", "Status", "Cohort", "Actions"];

export default function ApplicantsTable({
  applicants,
  cohorts,
  onAssignCohort,
  onAction,
}: ApplicantsTableProps) {
  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[90px_1.4fr_1.8fr_1fr_1.4fr_48px] gap-4 px-4 pb-3">
        {columns.map((column) => (
          <span key={column} className="text-sm font-medium text-gray-500">
            {column}
          </span>
        ))}
      </div>

      {/* Rows */}
      {applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              cohorts={cohorts}
              onAssignCohort={onAssignCohort}
              onAction={onAction}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">No applicants match your filters.</p>
        </div>
      )}
    </div>
  );
}
