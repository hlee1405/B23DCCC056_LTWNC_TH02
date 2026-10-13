import { Assignment } from '../types';

export interface AssignmentStatsResult {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byCourse: Record<string, { total: number; completed: number; overdue: number }>;
}

export function calcStats(assignments: Assignment[], now: Date = new Date()): AssignmentStatsResult {
  const total = assignments.length;
  let completed = 0;
  let overdue = 0;
  const byCourse: Record<string, { total: number; completed: number; overdue: number }> = {};

  for (const item of assignments) {
    if (!byCourse[item.course]) {
      byCourse[item.course] = { total: 0, completed: 0, overdue: 0 };
    }
    byCourse[item.course].total += 1;

    if (item.isCompleted) {
      completed += 1;
      byCourse[item.course].completed += 1;
    } else {
      const isPast = new Date(item.dueDate).getTime() < now.getTime();
      if (isPast) {
        overdue += 1;
        byCourse[item.course].overdue += 1;
      }
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
    byCourse,
  };
}
