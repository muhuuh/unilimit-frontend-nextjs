import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  pairInfo: {
    token0: {
      ticker: "USDC",
      decimals: 6,
    },
    token1: {
      ticker: "WETH",
      decimals: 18,
    },
  },
  ratio: 0,
};

const swapPairSlice = createSlice({
  name: "swap",
  initialState: defaultState,
  reducers: {
    updateTicker(state, action) {
      const newPairInfo = action.payload;
      console.log("newPairInfo");
      console.log(newPairInfo);
      state.pairInfo = newPairInfo;
    },
    updateRatio(state, action) {
      const newRatio = action.payload;
      state.token0Ratio = newRatio.token0;
      state.token1Ratio = newRatio.token1;
    },
  },
});

export const swapPairActions = swapPairSlice.actions;
export default swapPairSlice;
