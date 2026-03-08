import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-[#2d2d2d]"
      >
        Previous
      </button>
      
      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, i) => (
          <React.Fragment key={i}>
            {typeof p === 'number' ? (
              <button
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                  p === currentPage 
                  ? 'bg-[#FF9500] text-black border-[#FF9500] shadow-[0_0_10px_rgba(255,149,0,0.3)]' 
                  : 'bg-[#1a1a1a] text-gray-400 border-[#2d2d2d] hover:border-gray-500'
                }`}
              >
                {p}
              </button>
            ) : (
              <span className="px-1 text-gray-600">...</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-[#2d2d2d]"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
