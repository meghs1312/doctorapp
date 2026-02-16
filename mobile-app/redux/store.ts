import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './doctors/doctorSlice';
import filterReducer from './filters/filterSlice';


export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    filters: filterReducer,

  },
});
