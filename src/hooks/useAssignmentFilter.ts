import { useMemo } from 'react';
import { Assignment, AssignmentFilterState } from '../types';
import { genericFilter, genericSortBy } from '../utils/generics';
import { isOverdue } from '../utils/typeGuards';
import { usePinStore } from '../features/assignments/usePinStore';

export function useAssignmentFilter(
  assignments: Assignment[],
  filters: AssignmentFilterState
): Assignment[] {
  // Lấy danh sách ID đã ghim từ Zustand store
  const pinnedIds = usePinStore((state) => state.pinnedIds);

  // Kỹ thuật 2: Tối ưu với useMemo cho phần lọc dữ liệu
  return useMemo(() => {
    const now = new Date();

    // 1. Lọc theo trạng thái
    let result = genericFilter(assignments, (item) => {
      if (filters.status === 'completed') return item.isCompleted;
      if (filters.status === 'pending') return !item.isCompleted && !isOverdue(item, now);
      if (filters.status === 'overdue') return isOverdue(item, now);
      return true;
    });

    // 2. Lọc theo môn học
    if (filters.course !== 'all') {
      result = genericFilter(result, (item) => item.course === filters.course);
    }

    // 3. Lọc theo độ ưu tiên
    if (filters.priority !== 'all') {
      result = genericFilter(result, (item) => item.priority === filters.priority);
    }

    // 4. Tìm kiếm từ khóa
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = genericFilter(
        result,
        (item) =>
          item.title.toLowerCase().includes(q) || item.course.toLowerCase().includes(q)
      );
    }

    // 5. Sắp xếp theo tiêu chí đã chọn
    if (filters.sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      result = [...result].sort((a, b) => {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return filters.sortOrder === 'asc' ? diff : -diff;
      });
    } else {
      result = genericSortBy(result, filters.sortBy, filters.sortOrder);
    }

    // 6. Yêu cầu Zustand: Bài tập đã ghim luôn hiện lên đầu danh sách!
    if (pinnedIds.length > 0) {
      const pinnedSet = new Set(pinnedIds);
      const pinnedItems = result.filter((item) => pinnedSet.has(item.id));
      const unpinnedItems = result.filter((item) => !pinnedSet.has(item.id));
      result = [...pinnedItems, ...unpinnedItems];
    }

    return result;
  }, [assignments, filters, pinnedIds]);
}
