import { createSlice } from "@reduxjs/toolkit";

const DUMMY_OPEN_ORDERS = [
  {
    id: 0,
    wallet: "0xA6882d6bA4A27931F444dCfcaB9246741c5e71a7",
    contractAddress: "0x00B21014fa20Cd8C68c6A9648425947f76a093A8",
    pairKey: "",
    status: "active",
    side: "buy",
    quantity: 100,
    priceTarget: 1200,
  },
  {
    id: 1,
    wallet: "0xA6882d6bA4A27931F444dCfcaB9246741c5e71a7",
    contractAddress: "0x00B21014fa20Cd8C68c6A9648425947f76a093A5555555555",
    pairKey: "",
    status: "active",
    side: "sell",
    quantity: 500,
    priceTarget: 730,
  },
  {
    id: 2,
    wallet: "0xA6882d6bA4A27931F444dCfcaB9246741c5e71a7",
    contractAddress: "0x00B21014fa20Cd8C68c6A9648425947f76a093A8",
    pairKey: "",
    status: "inactive",
    side: "buy",
    quantity: 70,
    priceTarget: 1550,
  },
  {
    id: 3,
    wallet: "0xA6882d6bA4A27931F444dCfcaB9246741c5e71a7",
    contractAddress: "0x00B21014fa20Cd8C68c6A9648425947f76a093A7",
    pairKey: "",
    status: "active",
    side: "buy",
    quantity: 40,
    priceTarget: 1330,
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
        (order) => order.id != closeOrderId
      );
      state.openOrders = filteredOpenOrders;
    },
    addOpenOrder(state, action) {
      const newOrder = action.payload;

      const openOrderStore = state.openOrders;
      openOrderStore.push(newOrder);
    },
  },
});

export const openOrdersActions = openOrdersSlice.actions;
export default openOrdersSlice;
