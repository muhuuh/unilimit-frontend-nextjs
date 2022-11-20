import { configureStore } from "@reduxjs/toolkit";
import limitSlice from "./limit-slice";

const store = configureStore({
  reducer: { limit: limitSlice.reducer },
});

export default store;
