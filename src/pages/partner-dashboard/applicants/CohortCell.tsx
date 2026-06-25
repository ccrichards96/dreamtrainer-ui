import { ChevronDown } from "lucide-react";
import { Cohort } from "./types";

interface CohortCellProps {
  cohortId: string | null;
  cohorts: Cohort[];
  onAssign: (cohortId: string) => void;
}

/**
 * Renders the cohort assignment control for an applicant row.
 * Shows an "Assign to Cohort" prompt when unassigned, otherwise the
 * current cohort name — both backed by a native select for accessibility.
 */
export default function CohortCell({ cohortId, cohorts, onAssign }: CohortCellProps) {
  const isAssigned = cohortId !== null;

  return (
    <div className="relative inline-flex items-center">
      <select
        aria-label="Assign cohort"
        value={cohortId ?? ""}
        onChange={(e) => onAssign(e.target.value)}
        className={`appearance-none bg-transparent pr-6 text-sm focus:outline-none cursor-pointer ${
          isAssigned
            ? "font-semibold text-gray-800"
            : "font-semibold text-purple-600 underline underline-offset-2"
        }`}
      >
        {!isAssigned && (
          <option value="" disabled>
            Assign to Cohort
          </option>
        )}
        {cohorts.map((cohort) => (
          <option key={cohort.id} value={cohort.id}>
            {cohort.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute right-0 size-4 ${
          isAssigned ? "text-gray-400" : "text-purple-500"
        }`}
      />
    </div>
  );
}
