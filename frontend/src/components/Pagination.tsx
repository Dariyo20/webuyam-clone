interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          isFirst
            ? 'border-gray-200 text-gray-400 bg-white cursor-not-allowed'
            : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
        }`}
      >
        Previous
      </button>

      <span className="text-sm text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isLast
            ? 'border border-gray-200 text-gray-400 bg-white cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        Next
      </button>
    </div>
  );
}
