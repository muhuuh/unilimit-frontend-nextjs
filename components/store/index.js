import { configureStore } from "@reduxjs/toolkit";
import limitSlice from "./limit-slice";
import openOrdersSlice from "./openOrders-slice";

const store = configureStore({
  reducer: { limit: limitSlice.reducer, openOrders: openOrdersSlice.reducer },
});

export default store;
