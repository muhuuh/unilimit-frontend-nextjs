import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  user: "",
  openOrders: [
    {
      pool: "",
      positionId: "",
      trader: "",
      side: "",
      sqrtPriceX96: "",
      quantity: "",
      signature: "",
    },
  ],
  closedOrders: [{}],
  changedSize: [{}],
  settled: [{}],
};

const scrapingSlice = createSlice({
  name: "scraping",
  initialState: defaultState,
  reducers: {
    updateScrapingOpenOrders(state, action) {
      const scrapedOpenOrders = action.payload;
      state.openOrders = scrapedOpenOrders;
    },
  },
});

export const scrapingActions = scrapingSlice.actions;
export default scrapingSlice;
