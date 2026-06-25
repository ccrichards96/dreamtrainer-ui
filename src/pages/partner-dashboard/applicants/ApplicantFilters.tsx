import { ChevronDown } from "lucide-react";
import { ApplicantFilterValues, Cohort } from "./types";
import { statusFilterOptions } from "./statusConfig";

interface ApplicantFiltersProps {
  values: ApplicantFilterValues;
  cohorts: Cohort[];
  onChange: (values: ApplicantFilterValues) => void;
  onSearch: () => void;
}

export default function ApplicantFilters({
  values,
  cohorts,
  onChange,
  onSearch,
}: ApplicantFiltersProps) {
  const update = (patch: Partial<ApplicantFilterValues>) => onChange({ ...values, ...patch });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-end"
    >
      {/* Student name */}
      <div className="flex-1">
        <label htmlFor="filter-student-name" className="block text-xs text-gray-500 mb-1.5">
          Student Name
        </label>
        <input
          id="filter-student-name"
          type="text"
          value={values.studentName}
          onChange={(e) => update({ studentName: e.target.value })}
          placeholder="Student Name..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Cohort */}
      <div className="flex-1">
        <label htmlFor="filter-cohort" className="block text-xs text-gray-500 mb-1.5">
          Cohort
        </label>
        <div className="relative">
          <select
            id="filter-cohort"
            value={values.cohortId}
            onChange={(e) => update({ cohortId: e.target.value })}
            className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select a cohort...</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        </div>
      </div>

      {/* Status */}
      <div className="relative">
        <select
          aria-label="Filter by status"
          value={values.status}
          onChange={(e) => update({ status: e.target.value as ApplicantFilterValues["status"] })}
          className="appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {statusFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      </div>

      {/* Search */}
      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Search
      </button>
    </form>
  );
}
