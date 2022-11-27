import { configureStore } from "@reduxjs/toolkit";
import limitPairSlice from "./limitPair-slice";
import openOrdersSlice from "./openOrders-slice";

const store = configureStore({
  reducer: {
    limit: limitPairSlice.reducer,
    openOrders: openOrdersSlice.reducer,
  },
});

export default store;
