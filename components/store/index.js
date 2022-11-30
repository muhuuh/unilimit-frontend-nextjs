import { configureStore } from "@reduxjs/toolkit";
import limitPairSlice from "./limitPair-slice";
import openOrdersSlice from "./openOrders-slice";
import scrapingSlice from "./scraping-slice";

const store = configureStore({
  reducer: {
    limit: limitPairSlice.reducer,
    openOrders: openOrdersSlice.reducer,
    scraping: scrapingSlice.reducer,
  },
});

export default store;
