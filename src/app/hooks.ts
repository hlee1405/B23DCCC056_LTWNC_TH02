/**
 * @file app/hooks.ts
 * Buổi 3 — Redux Toolkit: Typed Hooks (useAppDispatch, useAppSelector)
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Sử dụng xuyên suốt trong toàn bộ ứng dụng thay vì `useDispatch` và `useSelector` thuần
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
