interface CohortFiltersProps {
  name: string;
  onNameChange: (name: string) => void;
  onSearch: () => void;
}

export default function CohortFilters({ name, onNameChange, onSearch }: CohortFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="filter-cohort-name" className="mb-1.5 block text-xs text-gray-500">
          Cohort Name
        </label>
        <input
          id="filter-cohort-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Cohort name..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Search
      </button>
    </div>
  );
}
