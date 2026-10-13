import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from '../features/assignments/assignmentSlice';
import filterReducer from '../features/assignments/filterSlice';
import { createLogger } from 'redux-logger';

// Chỉ bật ở môi trường development
const isDev =
  (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') ||
  Boolean(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV);

export const store = configureStore({
  reducer: {
    assignments: assignmentReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });

    if (isDev) {
      const logger = createLogger({
        collapsed: true,
        diff: true,
      });
      return middleware.concat(logger);
    }

    return middleware;
  },
});

// RootState type suy diễn tự động từ store
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type suy diễn từ store.dispatch
export type AppDispatch = typeof store.dispatch;

