import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step1: {},
  step2: {},
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    saveStep1(state, action) {
      state.step1 = action.payload;
    },
    saveStep2(state, action) {
      state.step2 = action.payload;
    },
    resetRegistration(state) {
      state.step1 = {};
      state.step2 = {};
    },
  },
});

export const { saveStep1, saveStep2, resetRegistration } =
  registrationSlice.actions;

export default registrationSlice.reducer;
