import { Applicant, ApplicantAction, Cohort } from "./types";
import ApplicantStatusBadge from "./ApplicantStatusBadge";
import CohortCell from "./CohortCell";
import ApplicantActionsMenu from "./ApplicantActionsMenu";

interface ApplicantRowProps {
  applicant: Applicant;
  cohorts: Cohort[];
  onAssignCohort: (applicantId: string, cohortId: string) => void;
  onAction: (action: ApplicantAction, applicant: Applicant) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString("en-US");
}

export default function ApplicantRow({
  applicant,
  cohorts,
  onAssignCohort,
  onAction,
}: ApplicantRowProps) {
  return (
    <div className="grid grid-cols-[90px_1.4fr_1.8fr_1fr_1.4fr_48px] items-center gap-4 rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
      {/* Date */}
      <span className="text-sm text-gray-600">{formatDate(applicant.appliedAt)}</span>

      {/* Applicant */}
      <div className="flex items-center gap-3">
        {applicant.avatarUrl ? (
          <img
            src={applicant.avatarUrl}
            alt=""
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="size-9 shrink-0 rounded-full bg-gray-200" />
        )}
        <span className="font-semibold text-gray-800">{applicant.name}</span>
      </div>

      {/* Bio */}
      <p className="line-clamp-2 text-sm text-gray-600">{applicant.bio}</p>

      {/* Status */}
      <div>
        <ApplicantStatusBadge status={applicant.status} />
      </div>

      {/* Cohort */}
      <CohortCell
        cohortId={applicant.cohortId}
        cohorts={cohorts}
        onAssign={(cohortId) => onAssignCohort(applicant.id, cohortId)}
      />

      {/* Actions */}
      <ApplicantActionsMenu applicant={applicant} onAction={onAction} />
    </div>
  );
}
