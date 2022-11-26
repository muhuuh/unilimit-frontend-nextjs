import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  wallet: "",
  token0Ticker: "WETH",
  token0Name: "Ethereum",
  token0Ratio: 0,
  token1Ticker: "DAI",
  token1Name: "DAI",
  token1Ratio: 0,
  quantity: 0,
  price: "",
  side: false,
};

const limitSlice = createSlice({
  name: "limit",
  initialState: defaultState,
  reducers: {
    updateRatio(state, action) {
      const newRatio = action.payload;
      state.token0Ratio = newRatio.token0;
      state.token1Ratio = newRatio.token1;
    },
    updateTicker(state, action) {
      const newTickers = action.payload;
      state.token0Ticker = newTickers.token0;
      state.token1Ticker = newTickers.token1;
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

export const limitActions = limitSlice.actions;
export default limitSlice;
