import { useEffect, useMemo, useState, lazy, Suspense, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchMockAssignments,
  generateStressTest,
  resetToSampleData,
} from './features/assignments/assignmentSlice';
import { setStatusFilter } from './features/assignments/filterSlice';
import { useAssignmentFilter } from './hooks/useAssignmentFilter';
import { useAssignmentStats } from './hooks/useAssignmentStats';
import { Assignment, FilterStatus } from './types';
import { extractUniqueValues } from './utils/generics';

import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { AssignmentList } from './components/AssignmentList';
import { AddAssignmentModal } from './components/AddAssignmentModal';
import { EditAssignmentModal } from './components/EditAssignmentModal';
import { useTheme } from './context/ThemeContext';
import { RotateCcw } from 'lucide-react';

// Kỹ thuật 4: React.lazy và Suspense cho trang / modal Thống kê chuyên sâu
const StatsDetailModal = lazy(() => import('./components/StatsDetailModal'));

export default function App() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const { data: assignments, status, error } = useAppSelector((state) => state.assignments);
  const filterState = useAppSelector((state) => state.filter);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    dispatch(fetchMockAssignments());
  }, [dispatch]);

  const stats = useAssignmentStats(assignments);
  const filteredAssignments = useAssignmentFilter(assignments, filterState);

  const availableCourses = useMemo(() => {
    return extractUniqueValues(assignments, 'course');
  }, [assignments]);

  // Handler tạo 10.000 bài tập mẫu (Stress test)
  const handleStressTest = useCallback(() => {
    dispatch(generateStressTest());
  }, [dispatch]);

  // Handler đặt lại dữ liệu mẫu
  const handleResetSample = useCallback(() => {
    dispatch(resetToSampleData());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark bg-slate-900 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Header
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenStatsModal={() => setIsStatsOpen(true)}
        onStressTest={handleStressTest}
        totalAssignments={assignments.length}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-4">
        {/* Banner thông báo khi ở chế độ Stress Test 10.000 bài */}
        {assignments.length >= 1000 && (
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center">
              <span>
                <strong>Chế độ Stress Test đang hoạt động:</strong> Đã tạo{' '}
                <strong>{assignments.length.toLocaleString()}</strong> bài tập mẫu.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetSample}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-slate-700 rounded font-semibold cursor-pointer flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu gốc</span>
            </button>
          </div>
        )}

        {/* Thống kê tổng quan */}
        <StatsOverview
          stats={stats}
          onFilterStatusSelect={(st: FilterStatus) => dispatch(setStatusFilter(st))}
        />

        {/* Bộ lọc */}
        <FilterBar
          availableCourses={availableCourses}
          counts={{
            all: stats.total,
            pending: stats.pending,
            overdue: stats.overdue,
            completed: stats.completed,
          }}
        />

        {/* Tiêu đề danh sách */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Danh sách bài tập ({filteredAssignments.length.toLocaleString()} / {assignments.length.toLocaleString()})
          </div>
          {assignments.length > 50 && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Đã tối ưu với Virtualization & Memo
            </span>
          )}
        </div>

        {/* Danh sách bài tập (Hỗ trợ ảo hóa react-window khi lớn) */}
        <AssignmentList
          status={status}
          error={error}
          onRetry={() => dispatch(fetchMockAssignments())}
          isEmpty={filteredAssignments.length === 0}
          assignments={filteredAssignments}
          onEditAssignment={(item) => setEditingAssignment(item)}
        />
      </main>

      <AddAssignmentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        availableCourses={availableCourses}
      />

      <EditAssignmentModal
        isOpen={editingAssignment !== null}
        onClose={() => setEditingAssignment(null)}
        assignment={editingAssignment}
      />

      {/* Kỹ thuật 4: Suspense bọc quanh component lazy load */}
      {isStatsOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-sm text-slate-600 dark:text-slate-300">
                Đang tải thống kê (Lazy loading component)...
              </div>
            </div>
          }
        >
          <StatsDetailModal
            isOpen={isStatsOpen}
            onClose={() => setIsStatsOpen(false)}
            assignments={assignments}
          />
        </Suspense>
      )}
    </div>
  );
}
