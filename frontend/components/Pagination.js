const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, totalPages]);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }

    if (currentPage <= 3) {
      pages.add(2);
      pages.add(3);
      pages.add(4);
    }

    if (currentPage >= totalPages - 2) {
      pages.add(totalPages - 3);
      pages.add(totalPages - 2);
      pages.add(totalPages - 1);
    }

    return [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
      .flatMap((page, index, sortedPages) => {
        const previous = sortedPages[index - 1];
        if (previous && page - previous > 1) return [`ellipsis-${previous}-${page}`, page];
        return [page];
      });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  if ( totalPages === 1) return null

  return (
    <div className="flex flex-wrap justify-center mt-4 gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded disabled:opacity-20 bg-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
    

      {getVisiblePages().map((page) => (
        typeof page === "string" ? (
          <span key={page} className="px-2 py-2 text-stone-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 bg-gray-500 rounded ${
              currentPage === page ? "bg-purple-700 text-white" : ""
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded disabled:opacity-20 bg-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
