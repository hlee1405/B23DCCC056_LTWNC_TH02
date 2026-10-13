import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from '../features/assignments/assignmentSlice';
import filterReducer from '../features/assignments/filterSlice';
import { AssignmentList } from '../components/AssignmentList';
import { Assignment } from '../types';

function renderWithRedux(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      assignments: assignmentReducer,
      filter: filterReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('PHẦN C - BẤT ĐỒNG BỘ TESTS (AssignmentList với API mock: loading, error, success)', () => {
  const dummyAssignments: Assignment[] = [
    {
      id: 'asg-async-1',
      title: 'Bài tập Async 1',
      course: 'Mạng máy tính',
      dueDate: '2026-10-30T00:00:00Z',
      priority: 'medium',
      isCompleted: false,
      createdAt: '2026-10-01T00:00:00Z',
    },
  ];

  // Test 1: Trạng thái đang tải (Loading)
  it('Async Test 1: Hiển thị thông báo đang tải khi status = "loading"', () => {
    renderWithRedux(
      <AssignmentList
        status="loading"
        error={null}
        assignments={[]}
        onEditAssignment={jest.fn()}
      />
    );

    expect(screen.getByText('Đang tải danh sách bài tập...')).toBeInTheDocument();
  });

  // Test 2: Trạng thái lỗi (Failed / Error) và nút Thử lại
  it('Async Test 2: Hiển thị thông báo lỗi và gọi onRetry khi người dùng bấm Thử lại', async () => {
    const user = userEvent.setup();
    const handleRetry = jest.fn();
    const errorMessage = 'Không thể kết nối máy chủ mock API';

    renderWithRedux(
      <AssignmentList
        status="failed"
        error={errorMessage}
        onRetry={handleRetry}
        assignments={[]}
        onEditAssignment={jest.fn()}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Thử lại/i });
    expect(retryBtn).toBeInTheDocument();

    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  // Test 3: Trạng thái thành công (Succeeded)
  it('Async Test 3: Hiển thị danh sách bài tập khi tải thành công (status = "succeeded")', () => {
    renderWithRedux(
      <AssignmentList
        status="succeeded"
        error={null}
        assignments={dummyAssignments}
        onEditAssignment={jest.fn()}
      />
    );

    expect(screen.getByText('Bài tập Async 1')).toBeInTheDocument();
    expect(screen.getByText('Mạng máy tính')).toBeInTheDocument();
  });

  // Test 4: Trạng thái rỗng (Empty)
  it('Async Test 4: Hiển thị thông báo khi không có bài tập nào phù hợp (isEmpty = true)', () => {
    renderWithRedux(
      <AssignmentList
        status="succeeded"
        error={null}
        isEmpty={true}
        assignments={[]}
        onEditAssignment={jest.fn()}
      />
    );

    expect(screen.getByText('Chưa có bài tập nào phù hợp.')).toBeInTheDocument();
  });
});
