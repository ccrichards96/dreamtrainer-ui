import { CohortStatus } from "../../../types/cohorts";

interface StatusStyle {
  label: string;
  /** Tailwind classes for the status pill / control */
  className: string;
}

export const cohortStatusConfig: Record<CohortStatus, StatusStyle> = {
  active: {
    label: "Open to Applicants",
    className: "bg-cyan-100 text-cyan-700",
  },
  archived: {
    label: "Archived",
    className: "bg-gray-200 text-gray-600",
  },
};

export const cohortStatusOptions: CohortStatus[] = ["active", "archived"];
