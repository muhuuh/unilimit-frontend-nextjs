import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  user: "",
  openOrders: [{}],
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
