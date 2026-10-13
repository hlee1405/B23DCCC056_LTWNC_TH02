import React from 'react';
import { Plus, Sun, Moon, BarChart3, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenStatsModal: () => void;
  onStressTest: () => void;
  totalAssignments: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenStatsModal,
  onStressTest,
  totalAssignments,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors"
      id="header"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Student Deadline Tracker
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Lab 2
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản lý hạn nộp bài tập cá nhân &middot; {totalAssignments.toLocaleString()} bài tập
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Tạo 10.000 bài tập mẫu (Stress test) */}
          <button
            type="button"
            id="btn-stress-test"
            data-testid="btn-stress-test"
            onClick={onStressTest}
            className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            title="Tạo 10.000 bài tập để đo stress test"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo 10.000 bài</span>
            <span className="sm:hidden">10k</span>
          </button>

          {/* Nút Xem Thống Kê (React.lazy + Suspense) */}
          <button
            type="button"
            id="btn-stats-detail"
            data-testid="btn-stats-detail"
            onClick={onOpenStatsModal}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            title="Xem thống kê theo môn học (React.lazy)"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thống kê</span>
          </button>

          {/* Nút Chuyển đổi Theme Sáng/Tối (Context nâng cao) */}
          <button
            type="button"
            id="btn-toggle-theme"
            data-testid="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Nút Thêm bài tập */}
          <button
            type="button"
            id="btn-add"
            data-testid="btn-add"
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập</span>
          </button>
        </div>
      </div>
    </header>
  );
};
