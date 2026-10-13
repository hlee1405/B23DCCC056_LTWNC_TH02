import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockAssignmentApi } from '../../services/mockApi';
import { Assignment, AsyncState, NewAssignmentPayload, UpdateAssignmentPayload } from '../../types';
import { generate10kAssignments } from '../../utils/stressData';

export interface AssignmentState extends AsyncState<Assignment[]> {}

const initialState: AssignmentState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchMockAssignments = createAsyncThunk<Assignment[], void, { rejectValue: string }>(
  'assignments/fetchMockAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.getAssignments();
      return response.data;
    } catch {
      return rejectWithValue('Không thể tải dữ liệu từ API giả lập');
    }
  }
);

export const resetToSampleData = createAsyncThunk<Assignment[], void, { rejectValue: string }>(
  'assignments/resetToSampleData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.reset();
      return response.data;
    } catch {
      return rejectWithValue('Không thể đặt lại dữ liệu mẫu');
    }
  }
);

export const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<NewAssignmentPayload>) => {
      const newItem: Assignment = {
        id: `asg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...action.payload,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      state.data.unshift(newItem);
      mockAssignmentApi.save(state.data);
    },

    toggleAssignment: (state, action: PayloadAction<string>) => {
      const item = state.data.find((a) => a.id === action.payload);
      if (item) {
        item.isCompleted = !item.isCompleted;
        mockAssignmentApi.save(state.data);
      }
    },

    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((a) => a.id !== action.payload);
      mockAssignmentApi.save(state.data);
    },

    updateAssignment: (state, action: PayloadAction<UpdateAssignmentPayload>) => {
      const { id, ...updates } = action.payload;
      const index = state.data.findIndex((a) => a.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updates };
        mockAssignmentApi.save(state.data);
      }
    },

    generateStressTest: (state) => {
      state.data = generate10kAssignments(10000);
      state.status = 'succeeded';
      state.error = null;
    },

    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.data = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },

    clearAllAssignments: (state) => {
      state.data = [];
      mockAssignmentApi.save([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMockAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchMockAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Lỗi tải dữ liệu';
      })
      .addCase(resetToSampleData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  },
});

export const {
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  updateAssignment,
  generateStressTest,
  setAssignments,
  clearAllAssignments,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
