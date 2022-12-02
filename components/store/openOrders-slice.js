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
  changedSize: [{}],
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
    //--------------- general data scraping info --------------------
    updateScrapingOpenOrders(state, action) {
      let scrapedOpenOrders = action.payload;
      state.openOrders = scrapedOpenOrders;
      state.allOrdersOverview = scrapedOpenOrders;
    },
    updateClosedIds(state, action) {
      let closedOrdersIds = action.payload;
      state.closedOrdersId = closedOrdersIds;
      /*
      let allOpenOrders = state.openOrders;
      allOpenOrders.map((order) => {
        console.log("orderid slice");
        console.log(order.positionId);
        if (closedOrdersIds.includes(order.positionId)) {
          console.log("closed id found");
          console.log(order.positionId);
          order = { ...order, status: "closed" };
        }
      });
      */
    },
    updateLatestOrderState(state, action) {
      let latestOrdersState = action.payload;
      state.allOrdersOverview = latestOrdersState;
    },
  },
});

export const openOrdersActions = openOrdersSlice.actions;
export default openOrdersSlice;
