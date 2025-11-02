import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationResponse } from "../types";

interface PaginationControlsProps {
  pagination: PaginationResponse | undefined;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  if (!pagination || pagination.lastPage <= 1) {
    return null;
  }

  const { currentPage: current_page, lastPage: last_page, hasNextPage: has_next_page } = pagination;
  const has_prev_page = current_page > 1;

  return (
    <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t border-gray-100">
      <span className="text-sm text-gray-600">
        Page {current_page} of {last_page}
      </span>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(current_page - 1)} disabled={!has_prev_page} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => onPageChange(current_page + 1)} disabled={!has_next_page} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};