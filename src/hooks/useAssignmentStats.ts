import { useMemo } from 'react';
import { Assignment, AssignmentStatistics } from '../types';
import { isOverdue } from '../utils/typeGuards';

export function useAssignmentStats(assignments: Assignment[]): AssignmentStatistics {
  return useMemo(() => {
    const total = assignments.length;
    let completed = 0;
    let overdue = 0;
    const now = new Date();

    for (const item of assignments) {
      if (item.isCompleted) {
        completed += 1;
      } else if (isOverdue(item, now)) {
        overdue += 1;
      }
    }

    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
    };
  }, [assignments]);
}
