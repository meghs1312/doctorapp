import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  cities: [] as string[],
  specialities: [] as string[],
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
    setCities(state, action) {
      state.cities = Array.isArray(action.payload) ? action.payload : [];
    },
    setSpecialities(state, action) {
      state.specialities = Array.isArray(action.payload) ? action.payload : [];
    },
    toggleCity(state, action) {
      const city = action.payload;
      const idx = state.cities.indexOf(city);
      if (idx === -1) state.cities.push(city);
      else state.cities.splice(idx, 1);
    },
    toggleSpeciality(state, action) {
      const spec = action.payload;
      const idx = state.specialities.indexOf(spec);
      if (idx === -1) state.specialities.push(spec);
      else state.specialities.splice(idx, 1);
    },
    resetFilters(state) {
      state.search = '';
      state.cities = [];
      state.specialities = [];
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const {
  setSearch,
  setCities,
  setSpecialities,
  toggleCity,
  toggleSpeciality,
  resetFilters,
  setPage,
} = filterSlice.actions;

export default filterSlice.reducer;
