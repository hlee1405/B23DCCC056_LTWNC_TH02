export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type FilterStatus = 'all' | 'pending' | 'overdue' | 'completed';

export type SortField = 'dueDate' | 'priority' | 'course' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Assignment {
  id: string;
  course: string;
  title: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
}

// Utility Types
export type ReadonlyAssignment = Readonly<Assignment>;
export type NewAssignmentPayload = Omit<Assignment, 'id' | 'createdAt' | 'isCompleted'>;
export type UpdateAssignmentPayload = Pick<Assignment, 'id'> & Partial<Omit<Assignment, 'id' | 'createdAt'>>;

// Generic Types
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T> {
  data: T;
  status: AsyncStatus;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AssignmentFilterState {
  status: FilterStatus;
  course: string;
  priority: Priority | 'all';
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface AssignmentStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}
