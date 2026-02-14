import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDoctorsWithFilters,
  fetchDoctorById,
  fetchTopDoctors,
  registerDoctor,
} from './doctorThunks';

const initialState: {
  list: Array<Record<string, unknown>>;
  topDoctors: Array<Record<string, unknown>>;
  selectedDoctor: Record<string, unknown> | null;
  loading: boolean;
  listLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
} = {
  list: [],
  topDoctors: [],
  selectedDoctor: null,
  loading: false,
  listLoading: false,
  error: null,
  hasMore: false,
  page: 1,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearSelectedDoctor(state) {
      state.selectedDoctor = null;
    },
    clearList(state) {
      state.list = [];
      state.page = 1;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsWithFilters.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(fetchDoctorsWithFilters.fulfilled, (state, action) => {
        state.listLoading = false;
        const payload = action.payload as { doctors: unknown[]; hasMore: boolean; page: number; append?: boolean };
        if (payload.append) {
          state.list = [...state.list, ...(payload.doctors || [])];
        } else {
          state.list = payload.doctors || [];
        }
        state.hasMore = payload.hasMore ?? false;
        state.page = payload.page ?? 1;
      })
      .addCase(fetchDoctorsWithFilters.rejected, (state) => {
        state.listLoading = false;
      })
      .addCase(fetchTopDoctors.fulfilled, (state, action) => {
        state.topDoctors = (action.payload as unknown[]) || [];
      })
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = (action.payload as Record<string, unknown>) || null;
      })
      .addCase(fetchDoctorById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerDoctor.fulfilled, () => {});
      // registerDoctor.rejected can be handled in the form
  },
});

export const { clearSelectedDoctor, clearList } = doctorSlice.actions;
export default doctorSlice.reducer;
