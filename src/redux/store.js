import { configureStore } from '@reduxjs/toolkit';
import carSlice from '../features/carsSlice'

const store = configureStore({
  reducer: {
    cars: carSlice,
  },
});

export default store;
