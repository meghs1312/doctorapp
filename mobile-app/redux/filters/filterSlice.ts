import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  city: '',
  speciality: '',
  page: 1,
  limit: 10,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    setSpeciality(state, action) {
      state.speciality = action.payload;
    },
    resetFilters(state) {
      state.search = '';
      state.city = '';
      state.speciality = '';
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const {
  setSearch,
  setCity,
  setSpeciality,
  resetFilters,
  setPage,
} = filterSlice.actions;

export default filterSlice.reducer;
