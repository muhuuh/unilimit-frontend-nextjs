import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  token0: {
    ticker: "WETH",
    decimals: 18,
    token_address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  },
  token1: {
    ticker: "UNI",
    decimals: 18,
    token_address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  },
  ratio: 32,
};

const swapPairSlice = createSlice({
  name: "swap",
  initialState: defaultState,
  reducers: {
    updateTicker(state, action) {
      const newPairInfo = action.payload;
      console.log("newPairInfo");
      console.log(newPairInfo);
      state.token0 = newPairInfo.token0;
      state.token1 = newPairInfo.token1;
      state.ratio = newPairInfo.ratio;
    },
    updateRatio(state, action) {
      const newRatio = action.payload;
      state.ratio = newRatio;
    },
  },
});

export const swapPairActions = swapPairSlice.actions;
export default swapPairSlice;
