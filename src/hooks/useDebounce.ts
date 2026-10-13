import { useState, useEffect } from 'react';

/**
 * Hook useDebounce hoãn cập nhật giá trị sau một khoảng thời gian trễ (mặc định 300ms)
 * @param value Giá trị cần debounce
 * @param delayMs Thời gian trễ tính bằng mili-giây
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
