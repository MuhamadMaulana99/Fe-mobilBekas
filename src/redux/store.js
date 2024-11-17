import { configureStore } from "@reduxjs/toolkit";
import carSlice from "../features/carsSlice";
import merkSlice from "../features/merkSlice";
import loginSlice from "../features/loginSlice";
import weightSlice from "../features/weightSlice";
import recommendationSlice from "../features/recommendationSlice";

const store = configureStore({
  reducer: {
    cars: carSlice,
    merk: merkSlice,
    weight: weightSlice,
    recomendations: recommendationSlice,
    login: loginSlice,
  },
});

export default store;
