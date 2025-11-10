'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  sort: string;
}

export default function Pagination({ currentPage, totalPages, sort }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('sort', sort);
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Link>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Link
              key={pageNum}
              href={createPageURL(pageNum)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNum
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="px-2">...</span>
            <Link
              href={createPageURL(totalPages)}
              className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
            >
              {totalPages}
            </Link>
          </>
        )}
      </div>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}