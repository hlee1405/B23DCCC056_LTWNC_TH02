import { Assignment, FilterStatus, Priority } from '../types';

export function isValidPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['low', 'medium', 'high', 'urgent'].includes(value);
}

export function isValidFilterStatus(value: unknown): value is FilterStatus {
  return typeof value === 'string' && ['all', 'pending', 'overdue', 'completed'].includes(value);
}

export function isAssignment(item: unknown): item is Assignment {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.course === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.dueDate === 'string' &&
    typeof obj.isCompleted === 'boolean' &&
    isValidPriority(obj.priority)
  );
}

export function isOverdue(assignment: Assignment, now: Date = new Date()): boolean {
  if (assignment.isCompleted) return false;
  return new Date(assignment.dueDate).getTime() < now.getTime();
}
