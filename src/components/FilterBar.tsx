import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  resetFilters,
  setCourseFilter,
  setPriorityFilter,
  setSearchQuery,
  setSortBy,
  setStatusFilter,
} from '../features/assignments/filterSlice';
import { FilterStatus, Priority, SortField } from '../types';
import { Tabs } from './compound/TabsCompound';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';

interface FilterBarProps {
  availableCourses: string[];
  counts: {
    all: number;
    pending: number;
    overdue: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({ availableCourses, counts }) => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.filter);

  // Kỹ thuật 2: Local state input + useDebounce (300 ms) tránh re-filter liên tục khi gõ
  const [localSearch, setLocalSearch] = useState<string>(filterState.searchQuery);
  const debouncedSearch = useDebounce<string>(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    setLocalSearch(filterState.searchQuery);
  }, [filterState.searchQuery]);

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 space-y-3 transition-colors"
      id="filter-bar"
    >
      {/* Tabs trạng thái */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs.Root
          activeTab={filterState.status}
          onTabChange={(status) => dispatch(setStatusFilter(status as FilterStatus))}
        >
          <Tabs.Item id="all" label="Tất cả" count={counts.all} />
          <Tabs.Item id="pending" label="Chưa hoàn thành" count={counts.pending} />
          <Tabs.Item id="overdue" label="Quá hạn" count={counts.overdue} />
          <Tabs.Item id="completed" label="Đã hoàn thành" count={counts.completed} />
        </Tabs.Root>

        {(filterState.status !== 'all' ||
          filterState.course !== 'all' ||
          filterState.priority !== 'all' ||
          filterState.searchQuery !== '') && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch('');
              dispatch(resetFilters());
            }}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium"
          >
            Xoá bộ lọc
          </button>
        )}
      </div>

      {/* Tìm kiếm & Bộ lọc môn học, ưu tiên, sắp xếp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            role="searchbox"
            data-testid="search-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm kiếm bài tập (debounce 300ms)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <select
          value={filterState.course}
          onChange={(e) => dispatch(setCourseFilter(e.target.value))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
        >
          <option value="all">Tất cả môn học</option>
          {availableCourses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterState.priority}
          onChange={(e) => dispatch(setPriorityFilter(e.target.value as Priority | 'all'))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
        >
          <option value="all">Mọi độ ưu tiên</option>
          <option value="urgent">Khẩn cấp</option>
          <option value="high">Ưu tiên cao</option>
          <option value="medium">Bình thường</option>
          <option value="low">Thấp</option>
        </select>

        <select
          value={filterState.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as SortField))}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
        >
          <option value="dueDate">Sắp xếp: Hạn nộp</option>
          <option value="priority">Sắp xếp: Độ ưu tiên</option>
          <option value="course">Sắp xếp: Môn học</option>
          <option value="title">Sắp xếp: Tên bài</option>
          <option value="createdAt">Sắp xếp: Ngày tạo</option>
        </select>
      </div>
    </div>
  );
};
