import React from 'react';
import { AssignmentStatistics, FilterStatus } from '../types';

interface StatsOverviewProps {
  stats: AssignmentStatistics;
  onFilterStatusSelect?: (status: FilterStatus) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onFilterStatusSelect }) => {
  return (
    <div className="space-y-3" id="stats-overview">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onFilterStatusSelect && onFilterStatusSelect('all')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng bài tập</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {stats.total.toLocaleString()}
          </div>
        </div>

        <div
          onClick={() => onFilterStatusSelect && onFilterStatusSelect('pending')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Chưa hoàn thành</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {stats.pending.toLocaleString()}
          </div>
        </div>

        <div
          onClick={() => onFilterStatusSelect && onFilterStatusSelect('overdue')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 cursor-pointer hover:border-rose-300 dark:hover:border-rose-600 transition-colors"
        >
          <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Quá hạn nộp</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {stats.overdue.toLocaleString()}
          </div>
        </div>

        <div
          onClick={() => onFilterStatusSelect && onFilterStatusSelect('completed')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
        >
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Đã hoàn thành</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {stats.completed.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({stats.completionRate}%)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between gap-4 transition-colors">
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          Tiến độ: <strong>{stats.completed.toLocaleString()}</strong> / {stats.total.toLocaleString()} bài tập ({stats.completionRate}%)
        </div>
        <div className="w-48 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
