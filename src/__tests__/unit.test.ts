import { isOverdue } from '../utils/typeGuards';
import { calcDaysLeft } from '../utils/dateUtils';
import { calcStats } from '../utils/calcStats';
import assignmentReducer, {
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  updateAssignment,
  generateStressTest,
  clearAllAssignments,
  setAssignments,
  AssignmentState,
} from '../features/assignments/assignmentSlice';
import filterReducer, {
  setStatusFilter,
  setCourseFilter,
  setPriorityFilter,
  setSearchQuery,
  setSortBy,
  resetFilters,
  FilterState,
} from '../features/assignments/filterSlice';
import { usePinStore } from '../features/assignments/usePinStore';
import { Assignment } from '../types';

describe('PHẦN C - UNIT TESTS (Tối thiểu 5 test cases)', () => {
  const mockNow = new Date('2026-10-12T12:00:00Z');

  // Test 1: isOverdue (trường hợp bình thường, đã hoàn thành, quá hạn, trường hợp biên)
  describe('Unit Test 1: isOverdue', () => {
    it('trả về true khi quá hạn và chưa hoàn thành', () => {
      const overdueAssignment: Assignment = {
        id: '1',
        title: 'Báo cáo',
        course: 'Web',
        dueDate: '2026-10-10T12:00:00Z',
        priority: 'high',
        isCompleted: false,
        createdAt: '2026-10-01T00:00:00Z',
      };
      expect(isOverdue(overdueAssignment, mockNow)).toBe(true);
    });

    it('trả về false khi đã hoàn thành bất kể hạn nộp', () => {
      const completedAssignment: Assignment = {
        id: '2',
        title: 'Lab 1',
        course: 'Web',
        dueDate: '2026-10-01T12:00:00Z',
        priority: 'medium',
        isCompleted: true,
        createdAt: '2026-10-01T00:00:00Z',
      };
      expect(isOverdue(completedAssignment, mockNow)).toBe(false);
    });

    it('trả về false khi hạn nộp ở tương lai', () => {
      const futureAssignment: Assignment = {
        id: '3',
        title: 'Lab 2',
        course: 'AI',
        dueDate: '2026-10-20T12:00:00Z',
        priority: 'low',
        isCompleted: false,
        createdAt: '2026-10-01T00:00:00Z',
      };
      expect(isOverdue(futureAssignment, mockNow)).toBe(false);
    });
  });

  // Test 2: calcDaysLeft
  describe('Unit Test 2: calcDaysLeft', () => {
    it('tính chính xác số ngày còn lại đến hạn nộp (hạn tương lai)', () => {
      const dueDate = '2026-10-15T12:00:00Z'; // cách 3 ngày
      const days = calcDaysLeft(dueDate, mockNow);
      expect(days).toBe(3);
    });

    it('tính số ngày âm khi bài tập đã quá hạn', () => {
      const pastDueDate = '2026-10-10T12:00:00Z'; // trước 2 ngày
      const days = calcDaysLeft(pastDueDate, mockNow);
      expect(days).toBe(-2);
    });
  });

  // Test 3: calcStats (tổng quan và theo môn học, cả trường hợp biên mảng rỗng)
  describe('Unit Test 3: calcStats', () => {
    it('xử lý chính xác trường hợp biên: danh sách bài tập rỗng []', () => {
      const emptyStats = calcStats([], mockNow);
      expect(emptyStats.total).toBe(0);
      expect(emptyStats.completed).toBe(0);
      expect(emptyStats.pending).toBe(0);
      expect(emptyStats.overdue).toBe(0);
      expect(emptyStats.completionRate).toBe(0);
      expect(emptyStats.byCourse).toEqual({});
    });

    it('tính toán đúng tổng số, đã hoàn thành, quá hạn và thống kê theo môn học', () => {
      const sampleList: Assignment[] = [
        {
          id: '1',
          title: 'Bài 1',
          course: 'Web',
          dueDate: '2026-10-05T00:00:00Z', // quá hạn
          priority: 'urgent',
          isCompleted: false,
          createdAt: '',
        },
        {
          id: '2',
          title: 'Bài 2',
          course: 'Web',
          dueDate: '2026-10-20T00:00:00Z', // còn hạn
          priority: 'high',
          isCompleted: true,
          createdAt: '',
        },
        {
          id: '3',
          title: 'Bài 3',
          course: 'AI',
          dueDate: '2026-10-25T00:00:00Z', // còn hạn
          priority: 'medium',
          isCompleted: false,
          createdAt: '',
        },
      ];

      const res = calcStats(sampleList, mockNow);
      expect(res.total).toBe(3);
      expect(res.completed).toBe(1);
      expect(res.pending).toBe(2);
      expect(res.overdue).toBe(1);
      expect(res.completionRate).toBe(33); // 1 / 3 = 33%
      expect(res.byCourse['Web'].total).toBe(2);
      expect(res.byCourse['Web'].completed).toBe(1);
      expect(res.byCourse['AI'].total).toBe(1);
    });
  });

  // Test 4 & 5: Reducer của assignmentsSlice (cả trường hợp biên)
  describe('Unit Test 4 & 5: Reducer assignmentsSlice', () => {
    const initialAssignmentState: AssignmentState = {
      data: [
        {
          id: 'asg-1',
          title: 'Bài tập 1',
          course: 'Web',
          dueDate: '2026-10-20T00:00:00Z',
          priority: 'medium',
          isCompleted: false,
          createdAt: '2026-10-01T00:00:00Z',
        },
      ],
      status: 'idle',
      error: null,
    };

    it('addAssignment: thêm bài tập mới vào đầu danh sách', () => {
      const nextState = assignmentReducer(
        initialAssignmentState,
        addAssignment({
          title: 'Bài tập mới',
          course: 'Cơ sở dữ liệu',
          dueDate: '2026-10-30T00:00:00Z',
          priority: 'urgent',
        })
      );
      expect(nextState.data.length).toBe(2);
      expect(nextState.data[0].title).toBe('Bài tập mới');
      expect(nextState.data[0].isCompleted).toBe(false);
    });

    it('toggleAssignment: đảo ngược trạng thái hoàn thành', () => {
      const nextState = assignmentReducer(initialAssignmentState, toggleAssignment('asg-1'));
      expect(nextState.data[0].isCompleted).toBe(true);

      const revertState = assignmentReducer(nextState, toggleAssignment('asg-1'));
      expect(revertState.data[0].isCompleted).toBe(false);
    });

    it('deleteAssignment: xóa bài tập theo id', () => {
      const nextState = assignmentReducer(initialAssignmentState, deleteAssignment('asg-1'));
      expect(nextState.data.length).toBe(0);
    });

    it('updateAssignment: cập nhật thông tin bài tập thành công', () => {
      const nextState = assignmentReducer(
        initialAssignmentState,
        updateAssignment({
          id: 'asg-1',
          title: 'Bài tập 1 đã sửa',
          priority: 'urgent',
        })
      );
      expect(nextState.data[0].title).toBe('Bài tập 1 đã sửa');
      expect(nextState.data[0].priority).toBe('urgent');
    });

    // Trường hợp biên của Reducer
    it('Trường hợp biên: xử lý an toàn khi toggle, delete, update ID không tồn tại', () => {
      const nonExistentId = 'unknown-id-999';

      // Toggle ID không tồn tại
      const stateAfterToggle = assignmentReducer(
        initialAssignmentState,
        toggleAssignment(nonExistentId)
      );
      expect(stateAfterToggle.data).toEqual(initialAssignmentState.data);

      // Delete ID không tồn tại
      const stateAfterDelete = assignmentReducer(
        initialAssignmentState,
        deleteAssignment(nonExistentId)
      );
      expect(stateAfterDelete.data.length).toBe(1);

      // Update ID không tồn tại
      const stateAfterUpdate = assignmentReducer(
        initialAssignmentState,
        updateAssignment({ id: nonExistentId, title: 'Không tồn tại' })
      );
      expect(stateAfterUpdate.data).toEqual(initialAssignmentState.data);
    });

    it('setAssignments: cập nhật danh sách bài tập thủ công', () => {
      const customList: Assignment[] = [
        {
          id: 'manual-1',
          title: 'Bài tập thủ công',
          course: 'Mạng',
          dueDate: '2026-11-01T00:00:00Z',
          priority: 'low',
          isCompleted: false,
          createdAt: '',
        },
      ];
      const nextState = assignmentReducer(initialAssignmentState, setAssignments(customList));
      expect(nextState.data).toEqual(customList);
      expect(nextState.status).toBe('succeeded');
    });

    it('extraReducers: xử lý các trạng thái async thunk pending, fulfilled, rejected', () => {
      // fetchMockAssignments.pending
      let state = assignmentReducer(initialAssignmentState, {
        type: 'assignments/fetchMockAssignments/pending',
      });
      expect(state.status).toBe('loading');

      // fetchMockAssignments.fulfilled
      const dummyData: Assignment[] = [{ id: 'loaded-1', title: 'Loaded', course: 'DB', dueDate: '', priority: 'low', isCompleted: false, createdAt: '' }];
      state = assignmentReducer(state, {
        type: 'assignments/fetchMockAssignments/fulfilled',
        payload: dummyData,
      });
      expect(state.status).toBe('succeeded');
      expect(state.data).toEqual(dummyData);

      // fetchMockAssignments.rejected
      state = assignmentReducer(state, {
        type: 'assignments/fetchMockAssignments/rejected',
        payload: 'Lỗi tải dữ liệu',
      });
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Lỗi tải dữ liệu');

      // resetToSampleData.fulfilled
      state = assignmentReducer(state, {
        type: 'assignments/resetToSampleData/fulfilled',
        payload: dummyData,
      });
      expect(state.status).toBe('succeeded');
    });

    it('generateStressTest và clearAllAssignments: sinh 10.000 bài tập và xóa', () => {
      const stressState = assignmentReducer(initialAssignmentState, generateStressTest());
      expect(stressState.data.length).toBe(10000);
      expect(stressState.status).toBe('succeeded');

      const clearedState = assignmentReducer(stressState, clearAllAssignments());
      expect(clearedState.data.length).toBe(0);
    });
  });

  // Test coverage cho filterSlice
  describe('Unit Test: filterSlice Reducer', () => {
    const initialFilterState: FilterState = {
      status: 'all',
      course: 'all',
      priority: 'all',
      searchQuery: '',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    };

    it('cập nhật các bộ lọc và resetFilters chính xác', () => {
      let state = filterReducer(initialFilterState, setStatusFilter('completed'));
      expect(state.status).toBe('completed');

      state = filterReducer(state, setCourseFilter('Web'));
      expect(state.course).toBe('Web');

      state = filterReducer(state, setPriorityFilter('urgent'));
      expect(state.priority).toBe('urgent');

      state = filterReducer(state, setSearchQuery('test query'));
      expect(state.searchQuery).toBe('test query');

      state = filterReducer(state, setSortBy('priority'));
      expect(state.sortBy).toBe('priority');

      state = filterReducer(state, resetFilters());
      expect(state).toEqual(initialFilterState);
    });
  });

  // Test coverage cho Zustand usePinStore
  describe('Unit Test: Zustand usePinStore', () => {
    it('quản lý ghim và bỏ ghim bài tập', () => {
      const { getState } = usePinStore;

      expect(getState().isPinned('test-id-1')).toBe(false);

      // Ghim test-id-1
      getState().togglePin('test-id-1');
      expect(getState().isPinned('test-id-1')).toBe(true);
      expect(getState().pinnedIds).toContain('test-id-1');

      // Ghim thêm test-id-2
      getState().togglePin('test-id-2');
      expect(getState().isPinned('test-id-2')).toBe(true);

      // Bỏ ghim test-id-1
      getState().togglePin('test-id-1');
      expect(getState().isPinned('test-id-1')).toBe(false);
      expect(getState().isPinned('test-id-2')).toBe(true);
    });
  });
});
