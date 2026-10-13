import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssignmentFilterState, FilterStatus, Priority, SortField, SortOrder } from '../../types';

export type FilterState = AssignmentFilterState;

const initialState: AssignmentFilterState = {
  status: 'all',
  course: 'all',
  priority: 'all',
  searchQuery: '',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.status = action.payload;
    },
    setCourseFilter: (state, action: PayloadAction<string>) => {
      state.course = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<Priority | 'all'>) => {
      state.priority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortField>) => {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'asc';
      }
    },
    resetFilters: (state) => {
      state.status = 'all';
      state.course = 'all';
      state.priority = 'all';
      state.searchQuery = '';
      state.sortBy = 'dueDate';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setStatusFilter,
  setCourseFilter,
  setPriorityFilter,
  setSearchQuery,
  setSortBy,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
