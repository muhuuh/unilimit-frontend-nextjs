import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  token0Ticker: "WETH",
  token0Name: "Ethereum",
  token0Ratio: 0,
  token0Amount: "",
  token1Ticker: "DAI",
  token1Name: "DAI",
  token1Ratio: 0,
  token1Amount: "",
  minBid: 0,
  maxBid: 0,
};

const limitSlice = createSlice({
  name: "limit",
  initialState: defaultState,
  reducers: {
    updateRatio(state, action) {
      console.log("store updateAmount");
      const newRatio = action.payload;
      state.token0Ratio = newRatio.token0;
      state.token1Ratio = newRatio.token1;
    },
    updateTicker(state, action) {
      console.log("store tickerAmount");
      const newTickers = action.payload;
      state.token0Ticker = newTickers.token0;
      state.token1Ticker = newTickers.token1;
    },
    updateBids(state, action) {
      console.log("store tickerAmount");
      const newBids = action.payload;
      state.minBid = newBids.minBid;
      state.maxBid = newBids.maxBid;
      console.log(state.minBid);
      console.log(state.maxBid);
    },
  },
});

export const limitActions = limitSlice.actions;
export default limitSlice;
