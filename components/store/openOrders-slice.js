import { createSlice } from "@reduxjs/toolkit";

const DUMMY_OPEN_ORDERS = [
  {
    pool: "",
    positionId: "",
    trader: "",
    side: "",
    sqrtPriceX96: "",
    quantity: "",
    signature: "",
  },
];

const defaultState = {
  openOrders: DUMMY_OPEN_ORDERS,
  wallet: "0xA6882d6bA4A27931F444dCfcaB9246741c5e71a7",
};

const openOrdersSlice = createSlice({
  name: "limit",
  initialState: defaultState,
  reducers: {
    updatepairKey(state, action) {
      const keyPairs = action.payload;
      console.log("keyPairs");
      console.log(keyPairs);
      const currentOpenOrders = state.openOrders;
      console.log("currentOpenOrders[0]");
      console.log(currentOpenOrders[0].pairKey);
      for (let i = 0; i < currentOpenOrders.length; i++) {
        currentOpenOrders[i].pairKey = keyPairs[i];
      }
    },
    updateQuantity(state, action) {
      const newQuantity = action.payload;

      const openOrderStore = state.openOrders;
      const currentOrderIndex = newQuantity.id;
      const newOrderQuantity = newQuantity.quantity;
      openOrderStore[currentOrderIndex].quantity = newOrderQuantity;
    },
    closeOpenOrder(state, action) {
      const closeOrderId = action.payload;

      const openOrderStore = state.openOrders;
      const filteredOpenOrders = openOrderStore.filter(
        (order) => order.positionId != closeOrderId
      );
      state.openOrders = filteredOpenOrders;
    },
    addOpenOrder(state, action) {
      const newOrder = action.payload;

      const openOrderStore = state.openOrders;
      openOrderStore.push(newOrder);
    },
    updateScrapingOpenOrders(state, action) {
      let scrapedOpenOrders = action.payload;
      state.openOrders = scrapedOpenOrders;
    },
  },
});

export const openOrdersActions = openOrdersSlice.actions;
export default openOrdersSlice;
