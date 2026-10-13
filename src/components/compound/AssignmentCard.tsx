import React, { createContext, useContext, ReactNode, memo } from 'react';
import { Check, Edit, Trash2, Pin } from 'lucide-react';
import { Assignment, Priority } from '../../types';
import { useDeadlineCalculations } from '../../hooks/useDeadlineCalculations';
import { formatVietnameseDateTime } from '../../utils/dateUtils';
import { usePinStore } from '../../features/assignments/usePinStore';

interface AssignmentCardContextType {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
  onPin?: (id: string) => void;
  isPinned: boolean;
}

const AssignmentCardContext = createContext<AssignmentCardContextType | undefined>(undefined);

export function useAssignmentCardContext() {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('AssignmentCard components must be used inside <AssignmentCard.Root>');
  }
  return context;
}

interface RootProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
  onPin?: (id: string) => void;
  children: ReactNode;
}

function BaseRoot({ assignment, onToggle, onDelete, onEdit, onPin, children }: RootProps) {
  const isPinnedInStore = usePinStore((state) => state.pinnedIds.includes(assignment.id));
  const togglePinStore = usePinStore((state) => state.togglePin);

  const handlePin = onPin ?? togglePinStore;

  return (
    <AssignmentCardContext.Provider
      value={{
        assignment,
        onToggle,
        onDelete,
        onEdit,
        onPin: handlePin,
        isPinned: isPinnedInStore,
      }}
    >
      <div
        id={`assignment-card-${assignment.id}`}
        data-testid={`assignment-card-${assignment.id}`}
        className={`relative border rounded-lg p-4 transition-all duration-200 ${
          isPinnedInStore
            ? 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-700/60 shadow-sm'
            : assignment.isCompleted
            ? 'border-slate-200 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-800/40'
            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
        }`}
      >
        {isPinnedInStore && (
          <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Pin className="w-2.5 h-2.5 fill-current" />
            <span>ĐÃ GHIM</span>
          </div>
        )}
        {children}
      </div>
    </AssignmentCardContext.Provider>
  );
}

// Tối ưu kỹ thuật 1: React.memo cho Card Root
const MemoizedRoot = memo(BaseRoot);

function Checkbox() {
  const { assignment, onToggle } = useAssignmentCardContext();

  return (
    <button
      type="button"
      id={`btn-toggle-${assignment.id}`}
      data-testid={`btn-toggle-${assignment.id}`}
      onClick={() => onToggle(assignment.id)}
      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
        assignment.isCompleted
          ? 'bg-emerald-600 border-emerald-600 text-white'
          : 'border-slate-300 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 text-transparent'
      }`}
      title={assignment.isCompleted ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
    >
      <Check className="w-3.5 h-3.5 stroke-[3]" />
    </button>
  );
}

function CourseTag() {
  const { assignment } = useAssignmentCardContext();
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      {assignment.course}
    </span>
  );
}

function Title() {
  const { assignment, onEdit } = useAssignmentCardContext();
  return (
    <div className="flex-1 min-w-0">
      <h3
        onClick={() => onEdit && onEdit(assignment)}
        className={`text-sm font-semibold cursor-pointer truncate ${
          assignment.isCompleted
            ? 'line-through text-slate-400 dark:text-slate-500'
            : 'text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400'
        }`}
      >
        {assignment.title}
      </h3>
    </div>
  );
}

function DeadlineCountdown() {
  const { assignment } = useAssignmentCardContext();
  const { displayText, urgency } = useDeadlineCalculations(
    assignment.dueDate,
    assignment.isCompleted
  );

  let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
  if (urgency === 'completed') {
    badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  } else if (urgency === 'overdue') {
    badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (urgency === 'today') {
    badgeColor = 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  } else {
    badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
  }

  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      <span className={`px-2 py-0.5 rounded ${badgeColor}`}>{displayText}</span>
      <span className="text-slate-500 dark:text-slate-400">{formatVietnameseDateTime(assignment.dueDate)}</span>
    </div>
  );
}

function PriorityBadge() {
  const { assignment } = useAssignmentCardContext();

  const labels: Record<Priority, { text: string; cls: string }> = {
    urgent: { text: 'Khẩn cấp', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    high: { text: 'Ưu tiên cao', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    medium: { text: 'Bình thường', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    low: { text: 'Thấp', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  };

  const item = labels[assignment.priority];

  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${item.cls}`}>
      {item.text}
    </span>
  );
}

function Actions() {
  const { assignment, onDelete, onEdit, onPin, isPinned } = useAssignmentCardContext();

  return (
    <div className="flex items-center gap-1">
      {/* Nút Ghim bài tập quan trọng bằng Zustand */}
      <button
        type="button"
        id={`btn-pin-${assignment.id}`}
        data-testid={`btn-pin-${assignment.id}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onPin) onPin(assignment.id);
        }}
        className={`p-1.5 rounded cursor-pointer transition-colors ${
          isPinned
            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50'
            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title={isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
      >
        <Pin className={`w-4 h-4 ${isPinned ? 'fill-amber-500 rotate-45' : ''}`} />
      </button>

      {onEdit && (
        <button
          type="button"
          id={`btn-edit-${assignment.id}`}
          data-testid={`btn-edit-${assignment.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(assignment);
          }}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer transition-colors"
          title="Sửa bài tập"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}

      <button
        type="button"
        id={`btn-delete-${assignment.id}`}
        data-testid={`btn-delete-${assignment.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(assignment.id);
        }}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer transition-colors"
        title="Xoá bài tập"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export const AssignmentCard = Object.assign(MemoizedRoot, {
  Root: MemoizedRoot,
  Checkbox,
  CourseTag,
  Title,
  DeadlineCountdown,
  PriorityBadge,
  Actions,
});

// Component AssignmentCardItem bọc toàn bộ khung chuẩn, có React.memo
export interface AssignmentCardItemProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
  onPin?: (id: string) => void;
}

export const AssignmentCardItem: React.FC<AssignmentCardItemProps> = memo(
  ({ assignment, onToggle, onDelete, onEdit, onPin }) => {
    return (
      <AssignmentCard
        assignment={assignment}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onPin={onPin}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AssignmentCard.CourseTag />
            <AssignmentCard.PriorityBadge />
          </div>
          <AssignmentCard.Actions />
        </div>

        <div className="flex items-center gap-3 my-2">
          <AssignmentCard.Checkbox />
          <AssignmentCard.Title />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <AssignmentCard.DeadlineCountdown />
        </div>
      </AssignmentCard>
    );
  }
);
AssignmentCardItem.displayName = 'AssignmentCardItem';
