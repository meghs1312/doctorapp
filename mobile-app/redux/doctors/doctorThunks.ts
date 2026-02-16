import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet, apiPost } from '../../services/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, thunkAPI) => {
    try {
      const data = await apiGet('/doctors', { limit: 10, page: 1 });
      return data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed');
    }
  }
);

export const fetchDoctorsWithFilters = createAsyncThunk(
  'doctors/fetchDoctorsWithFilters',
  async (
    params: { search?: string; cities?: string[]; specialities?: string[]; page?: number; limit?: number; append?: boolean },
    thunkAPI
  ) => {
    try {
      const { append, ...query } = params;
      const data = await apiGet('/doctors', {
        search: query.search,
        city: query.cities?.length ? query.cities : undefined,
        speciality: query.specialities?.length ? query.specialities : undefined,
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      });
      return { ...data, append: !!append };
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed');
    }
  }
);

export const fetchTopDoctors = createAsyncThunk(
  'doctors/fetchTopDoctors',
  async (limit?: number, thunkAPI) => {
    try {
      const data = await apiGet('/doctors/top', limit ? { limit } : undefined);
      return Array.isArray(data) ? data : data?.doctors ?? [];
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchDoctorById',
  async (id: string | string[], thunkAPI) => {
    try {
      const doctorId = Array.isArray(id) ? id[0] : id;
      const data = await apiGet(`/doctors/${doctorId}`);
      return data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed');
    }
  }
);

export const registerDoctor = createAsyncThunk(
  'doctors/registerDoctor',
  async (payload: Record<string, unknown>, thunkAPI) => {
    try {
      const data = await apiPost('/doctors', payload);
      return data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed');
    }
  }
);
