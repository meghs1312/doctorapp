import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './doctors/doctorSlice';
import filterReducer from './filters/filterSlice';
import registrationReducer from './registration/registrationSlice';

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    filters: filterReducer,
    registration: registrationReducer,
  },
});
