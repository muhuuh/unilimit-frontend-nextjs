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
  changedQuantityOrders: [{}],
  closedOrdersId: [],
  settled: [{}],
  latestOrderStatus: [{}],
  allOrdersOverview: [{}],
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
    //----------------update visuals in table --------------
    updateQuantity(state, action) {
      const newQuantity = action.payload;
      const openOrderStore = state.openOrders;
      const newOrderQuantity = newQuantity.quantity;
      const currentId = newQuantity.id;
      let updateThatOrderIndex = openOrderStore.findIndex(
        (order) => order.positionId == currentId
      );
      let updateThatOrder = openOrderStore.find(
        (order) => order.positionId == currentId
      );

      updateThatOrder = { ...updateThatOrder, quantity: newOrderQuantity };
      openOrderStore[updateThatOrderIndex] = updateThatOrder;
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
    //--------------- general data scraping info --------------------
    updateScrapingOpenOrders(state, action) {
      let scrapedOpenOrders = action.payload;
      state.openOrders = scrapedOpenOrders;
      state.allOrdersOverview = scrapedOpenOrders;
    },
    updateClosedIds(state, action) {
      let closedOrdersIds = action.payload;
      state.closedOrdersId = closedOrdersIds;
    },
    updateQuantityOrders(state, action) {
      let changedQuantityOrders = action.payload;
      state.changedQuantityOrders = changedQuantityOrders;
    },
    updateLatestOrderState(state, action) {
      let latestOrdersState = action.payload;
      state.allOrdersOverview = latestOrdersState;
    },
  },
});

export const openOrdersActions = openOrdersSlice.actions;
export default openOrdersSlice;
