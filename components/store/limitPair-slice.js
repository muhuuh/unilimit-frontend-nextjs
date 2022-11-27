import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  wallet: "",
  pairInfo: {
    selectedPair: "USDC/WETH",
    token0: {
      ticker: "USDC",
      decimals: 6,
    },
    token1: {
      ticker: "WETH",
      decimals: 18,
    },
  },
  quantity: 0,
  price: 0,
  side: false,
};

const limitPairSlice = createSlice({
  name: "limit",
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
    updatePriQua(state, action) {
      const newLimitOrderPriQua = action.payload;
      state.quantity = newLimitOrderPriQua.quantity;
      state.price = newLimitOrderPriQua.price;
    },
    updateSide(state, action) {
      const orderSide = action.payload;
      state.side = orderSide;
    },
  },
});

export const limitPairActions = limitPairSlice.actions;
export default limitPairSlice;
