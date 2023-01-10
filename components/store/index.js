import { configureStore } from "@reduxjs/toolkit";
import limitPairSlice from "./limitPair-slice";
import swapPairSlice from "./swapPair-slice";
import openOrdersSlice from "./openOrders-slice";
import scrapingSlice from "./scraping-slice";

const store = configureStore({
  reducer: {
    limit: limitPairSlice.reducer,
    swap: swapPairSlice.reducer,
    openOrders: openOrdersSlice.reducer,
    scraping: scrapingSlice.reducer,
  },
});

export default store;
