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
    <div className="relative inline-flex items-center w-full max-w-[200px]">
      <select
        aria-label="Assign cohort"
        value={cohortId ?? ""}
        onChange={(e) => onAssign(e.target.value)}
        className={`w-full appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${
          isAssigned
            ? "border-gray-200 bg-gray-200 text-gray-800 hover:bg-gray-200/70 hover:border-gray-300"
            : "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300"
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
        className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 ${
          isAssigned ? "text-gray-500" : "text-purple-600"
        }`}
      />
    </div>
  );
}
