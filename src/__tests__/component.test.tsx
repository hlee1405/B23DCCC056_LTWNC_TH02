import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from '../features/assignments/assignmentSlice';
import filterReducer from '../features/assignments/filterSlice';
import { AssignmentCard, AssignmentCardItem } from '../components/compound/AssignmentCard';
import { AddAssignmentModal } from '../components/AddAssignmentModal';
import { Assignment } from '../types';
import { usePinStore } from '../features/assignments/usePinStore';

// Helper tạo mock store
function renderWithRedux(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      assignments: assignmentReducer,
      filter: filterReducer,
    },
  });
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

describe('PHẦN C - COMPONENT TESTS (RTL + userEvent) (Tối thiểu 4 test cases)', () => {
  const mockAssignment: Assignment = {
    id: 'asg-test-101',
    title: 'Xây dựng REST API với Node.js',
    course: 'Lập trình Web nâng cao',
    dueDate: '2026-10-25T23:59:00Z',
    priority: 'high',
    isCompleted: false,
    createdAt: '2026-10-01T00:00:00Z',
  };

  beforeEach(() => {
    // Reset Zustand store
    usePinStore.setState({ pinnedIds: [] });
  });

  // Test 1: AssignmentCard hiển thị thông tin
  it('Component Test 1: AssignmentCard hiển thị đúng tiêu đề, môn học và huy hiệu ưu tiên', () => {
    const handleToggle = jest.fn();
    const handleDelete = jest.fn();

    render(
      <AssignmentCardItem
        assignment={mockAssignment}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Xây dựng REST API với Node.js')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web nâng cao')).toBeInTheDocument();
    expect(screen.getByText('Ưu tiên cao')).toBeInTheDocument();
  });

  // Test 2: Nút hoàn thành bài tập (toggle)
  it('Component Test 2: Click nút checkbox hoàn thành gọi hàm onToggle với đúng ID', async () => {
    const user = userEvent.setup();
    const handleToggle = jest.fn();
    const handleDelete = jest.fn();

    render(
      <AssignmentCardItem
        assignment={mockAssignment}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    );

    const toggleBtn = screen.getByTestId(`btn-toggle-${mockAssignment.id}`);
    await user.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockAssignment.id);
  });

  // Test 3: Nút ghim bài tập quan trọng (Zustand)
  it('Component Test 3: Click nút ghim gọi handler onPin hoặc cập nhật trạng thái ghim', async () => {
    const user = userEvent.setup();
    const handlePin = jest.fn();

    render(
      <AssignmentCardItem
        assignment={mockAssignment}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onPin={handlePin}
      />
    );

    const pinBtn = screen.getByTestId(`btn-pin-${mockAssignment.id}`);
    await user.click(pinBtn);

    expect(handlePin).toHaveBeenCalledTimes(1);
    expect(handlePin).toHaveBeenCalledWith(mockAssignment.id);
  });

  // Test 4: Form thêm bài tập (AddAssignmentModal) - Validate khi thiếu tiêu đề
  it('Component Test 4: Form thêm bài tập hiển thị lỗi validate khi để trống tên bài tập', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    renderWithRedux(
      <AddAssignmentModal
        isOpen={true}
        onClose={handleClose}
        availableCourses={['Lập trình Web nâng cao']}
      />
    );

    // Bấm nút Tạo bài tập khi title rỗng
    const submitBtn = screen.getByRole('button', { name: /Tạo bài tập/i });
    await user.click(submitBtn);

    // Phải hiển thị thông báo lỗi
    expect(screen.getByTestId('form-error')).toHaveTextContent('Vui lòng nhập tên bài tập.');
    expect(handleClose).not.toHaveBeenCalled();
  });

  // Test 5: Form thêm bài tập (AddAssignmentModal) - Submit thành công
  it('Component Test 5: Form thêm bài tập submit thành công và dispatch action khi nhập hợp lệ', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    const { store } = renderWithRedux(
      <AddAssignmentModal
        isOpen={true}
        onClose={handleClose}
        availableCourses={['Lập trình Web nâng cao']}
      />
    );

    const titleInput = screen.getByLabelText(/Tên bài tập/i);
    await user.type(titleInput, 'Bài tập thực hành số 2');

    const submitBtn = screen.getByRole('button', { name: /Tạo bài tập/i });
    await user.click(submitBtn);

    // Kiểm tra state Redux đã được thêm bài mới
    const state = store.getState().assignments;
    expect(state.data.length).toBe(1);
    expect(state.data[0].title).toBe('Bài tập thực hành số 2');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
