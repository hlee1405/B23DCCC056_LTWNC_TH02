import React, { useCallback, useState } from 'react';
import * as ReactWindow from 'react-window';
import { ListChildComponentProps } from 'react-window';
import { Assignment } from '../types';
import { useAppDispatch } from '../app/hooks';
import { deleteAssignment, toggleAssignment } from '../features/assignments/assignmentSlice';
import { AssignmentCardItem } from './compound/AssignmentCard';
import { withAsyncHandler } from './hoc/withAsyncHandler';

// Hỗ trợ tương thích cả Vite dev server lẫn Jest CommonJS/ESM
const FixedSizeList: any =
  (ReactWindow as any).FixedSizeList ||
  (ReactWindow as any).default?.FixedSizeList ||
  (ReactWindow as any).default;

interface AssignmentListProps {
  assignments: Assignment[];
  onEditAssignment: (assignment: Assignment) => void;
}

const RawAssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onEditAssignment,
}) => {
  const dispatch = useAppDispatch();
  const [useVirtualization, setUseVirtualization] = useState<boolean>(assignments.length > 50);

  // Kỹ thuật 1: useCallback cho các handler truyền xuống để kết hợp React.memo
  const handleToggle = useCallback((id: string) => {
    dispatch(toggleAssignment(id));
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteAssignment(id));
  }, [dispatch]);

  const handleEdit = useCallback((item: Assignment) => {
    onEditAssignment(item);
  }, [onEditAssignment]);

  // Row renderer cho react-window
  const VirtualizedRow = ({ index, style }: ListChildComponentProps) => {
    const item = assignments[index];
    if (!item) return null;

    return (
      <div style={{ ...style, paddingBottom: 10 }}>
        <AssignmentCardItem
          assignment={item}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    );
  };

  const isLargeList = assignments.length > 50;

  return (
    <div className="space-y-3" id="assignment-list" data-testid="assignment-list">
      {/* Thanh điều khiển ảo hóa khi danh sách lớn hoặc stress test */}
      {isLargeList && (
        <div className="flex items-center justify-between p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-900 dark:text-blue-200">
          <div className="font-medium">
            <span>
              {useVirtualization
                ? `Đang bật Virtualization (react-window) cho ${assignments.length.toLocaleString()} bài tập (DOM chỉ render ~6 phần tử)`
                : `Đang tắt Virtualization (Render toàn bộ ${assignments.length.toLocaleString()} DOM nodes)`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseVirtualization(!useVirtualization)}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded shadow-xs hover:bg-blue-50 dark:hover:bg-slate-700 font-semibold cursor-pointer"
          >
            {useVirtualization ? 'Tắt Virtualization để đo so sánh' : 'Bật Virtualization'}
          </button>
        </div>
      )}

      {useVirtualization && isLargeList ? (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50/30 dark:bg-slate-900/20 p-1">
          <FixedSizeList
            height={600}
            itemCount={assignments.length}
            itemSize={135}
            width="100%"
          >
            {VirtualizedRow}
          </FixedSizeList>
        </div>
      ) : (
        <div className="space-y-2.5">
          {assignments.map((assignment) => (
            <AssignmentCardItem
              key={assignment.id}
              assignment={assignment}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AssignmentList = withAsyncHandler(RawAssignmentList);
