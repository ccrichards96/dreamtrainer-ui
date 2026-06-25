interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Accessible label for the nav landmark */
  label?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="flex flex-col items-center gap-1" aria-label={label}>
      <span className="text-sm font-medium text-gray-600">Page</span>
      <div className="flex items-center gap-4 text-sm">
        <button
          type="button"
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="font-medium text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={`flex size-7 items-center justify-center rounded-full text-sm font-medium transition ${
                  isActive ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="font-medium text-purple-600 hover:text-purple-800 disabled:cursor-not-allowed disabled:text-purple-300"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
