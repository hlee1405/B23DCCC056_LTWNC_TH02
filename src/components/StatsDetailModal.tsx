import React from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { Assignment } from '../types';
import { calcStats } from '../utils/calcStats';

interface StatsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
}

export const StatsDetailModal: React.FC<StatsDetailModalProps> = ({
  isOpen,
  onClose,
  assignments,
}) => {
  if (!isOpen) return null;

  const stats = calcStats(assignments);
  const courses = Object.keys(stats.byCourse);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Thống kê chuyên sâu (Lazy Loaded Component)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân tích số bài hoàn thành, quá hạn và tiến độ chi tiết theo từng môn học
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung tổng quan */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Card tổng kết */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-slate-500 dark:text-blue-300 font-medium">Tổng số bài</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {stats.total.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="text-slate-500 dark:text-emerald-300 font-medium">Đã xong</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {stats.completed.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="text-slate-500 dark:text-amber-300 font-medium">Chưa xong</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {stats.pending.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg">
              <div className="text-slate-500 dark:text-rose-300 font-medium">Quá hạn</div>
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {stats.overdue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Danh sách theo môn học */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Tiến độ theo môn học ({courses.length} môn)
            </h3>

            {courses.length === 0 ? (
              <div className="text-center py-6 text-slate-400">Không có dữ liệu môn học</div>
            ) : (
              <div className="space-y-2.5">
                {courses.map((courseName) => {
                  const cStats = stats.byCourse[courseName];
                  const rate = cStats.total > 0 ? Math.round((cStats.completed / cStats.total) * 100) : 0;

                  return (
                    <div
                      key={courseName}
                      className="p-3.5 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {courseName}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {cStats.completed}/{cStats.total} ({rate}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${rate}%` }}
                        />
                        {cStats.overdue > 0 && (
                          <div
                            className="bg-rose-500 h-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100 - rate, Math.round((cStats.overdue / cStats.total) * 100))}%`,
                            }}
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Đã hoàn thành: {cStats.completed}
                        </span>
                        <span className="text-rose-600 dark:text-rose-400">
                          Quá hạn: {cStats.overdue}
                        </span>
                        <span>
                          Tổng: {cStats.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsDetailModal;
