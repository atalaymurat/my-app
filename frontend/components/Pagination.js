const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  if ( totalPages === 1) return null

  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded disabled:opacity-20 bg-gray-500"
      >
        Önceki
      </button>
    

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 bg-gray-500 rounded ${
            currentPage === page ? "bg-purple-700 text-white" : ""
          }`}
        >
          {page}
          
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded disabled:opacity-20 bg-gray-500"
      >
        Sonraki
      </button>
    </div>
  );
};

export default Pagination;
