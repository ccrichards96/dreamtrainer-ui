import { ChevronDown } from "lucide-react";
import { CohortStatus } from "../../../types/cohorts";
import { cohortStatusConfig, cohortStatusOptions } from "./statusConfig";

interface CohortStatusControlProps {
  status: CohortStatus;
  onChange: (status: CohortStatus) => void;
  disabled?: boolean;
}

/** Pill-styled status selector that maps cohort status to a friendly label. */
export default function CohortStatusControl({
  status,
  onChange,
  disabled,
}: CohortStatusControlProps) {
  const config = cohortStatusConfig[status];

  return (
    <div className="relative inline-flex">
      <select
        aria-label="Cohort status"
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as CohortStatus)}
        className={`cursor-pointer appearance-none rounded-lg py-2 pl-4 pr-9 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60 ${config.className}`}
      >
        {cohortStatusOptions.map((option) => (
          <option key={option} value={option}>
            {cohortStatusConfig[option].label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-70" />
    </div>
  );
}
