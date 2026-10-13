import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('PHẦN C - HOOK TESTS (renderHook & fake timers)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Hook Test 1: useDebounce chỉ cập nhật giá trị sau đúng khoảng thời gian delay 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'khoa hoc', delay: 300 },
      }
    );

    // Giá trị ban đầu lập tức nhận được
    expect(result.current).toBe('khoa hoc');

    // Thay đổi props giá trị mới
    rerender({ value: 'khoa hoc may tinh', delay: 300 });

    // Trước 300ms (ví dụ sau 150ms): vẫn giữ giá trị cũ
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('khoa hoc');

    // Sau khi thêm 150ms (tổng 300ms): giá trị cập nhật sang giá trị mới
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('khoa hoc may tinh');
  });

  it('Hook Test 2: useDebounce reset lại timer khi giá trị thay đổi liên tục trước khi timeout hoàn tất', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'A', delay: 300 },
      }
    );

    // Người dùng gõ 'B' sau 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'AB', delay: 300 });

    // Tiếp tục gõ 'C' sau 100ms nữa
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'ABC', delay: 300 });

    // Sau 200ms nữa (vẫn chưa đủ 300ms kể từ lần gõ cuối 'ABC'): giá trị vẫn là 'A'
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('A');

    // Chờ thêm 100ms (đủ 300ms kể từ lần gõ 'ABC'): giá trị nhảy thẳng sang 'ABC'
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('ABC');
  });
});
