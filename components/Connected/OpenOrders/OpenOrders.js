import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openOrdersActions } from "../../store/openOrders-slice";
import OpenOrdersTable from "./OpenOrdersTable";
import contractAddresses from "../../../constants/contractAddress.json" assert { type: "json" };

const OpenOrders = () => {
  const openOrderStore = useSelector((state) => state.openOrders.openOrders);
  const closedOrdersIds = useSelector(
    (state) => state.openOrders.closedOrdersId
  );
  const changedQuantityOrders = useSelector(
    (state) => state.openOrders.changedQuantityOrders
  );
  const settledOrders = useSelector((state) => state.openOrders.settled);
  const dispatch = useDispatch();

  const allOrdersIds = [];
  openOrderStore.map((order) => allOrdersIds.push(order.positionId));
  const changedOrdersIds = [];
  changedQuantityOrders.map((order) => changedOrdersIds.push(order.positionId));
  const settledOrdersIds = [];
  settledOrders.map((order) => settledOrdersIds.push(order.positionId));

  let openOrdersItem2;
  let openOrdersItem4;
  let testArray = [];
  if (openOrderStore.length > 0) {
    let updatedStatusOrder = [];

    openOrdersItem2 = openOrderStore.map((order) => {
      console.log("order.id");
      console.log(order.positionId);

      if (closedOrdersIds.includes(order.positionId)) {
        console.log("order found");
        order = { ...order, status: "closed" };
        console.log("order closed");
        console.log(order);
      } else {
        order = { ...order, status: "open" };
      }

      testArray.push(order);
      return;
    });

    let testArray2 = [];
    testArray.map((order) => {
      if (settledOrdersIds.includes(order.positionId)) {
        order = { ...order, status: "settled" };
      }
      testArray2.push(order);
      return;
    });

    console.log("settled view");
    console.log(testArray2);

    let loopCount = 0;
    let currentDecimalsQuantity, newCurrentQuantity;
    changedOrdersIds.map((quantityIds) => {
      if (allOrdersIds.includes(quantityIds)) {
        console.log("quantityIds found");
        console.log(quantityIds);
        let currentOrder = testArray2.find(
          (order) => order.positionId === quantityIds
        );
        console.log("currentOrder in loop");
        console.log(currentOrder);
        const currentPair = currentOrder.pair;
        const pairDecimals = contractAddresses[String(currentPair)].decimals;
        if (currentOrder.side) {
          currentDecimalsQuantity = pairDecimals.token1;
        } else {
          currentDecimalsQuantity = pairDecimals.token0;
        }
        newCurrentQuantity =
          changedQuantityOrders[loopCount].newQuantity /
          10 ** currentDecimalsQuantity;
        //currentOrder.quantity = changedQuantityOrders[loopCount].newQuantity;
        console.log("changedQuantityOrders[loopCount].newQuantity");
        console.log(changedQuantityOrders[loopCount].newQuantity);
        currentOrder = {
          ...currentOrder,
          //quantity: changedQuantityOrders[loopCount].newQuantity,
          quantity: newCurrentQuantity,
        };
        console.log();
        console.log("new currentOrder in loop");
        console.log(currentOrder);
        loopCount++;

        let currentOrderIndex = testArray2.findIndex(
          (order) => order.positionId === quantityIds
        );
        console.log("currentOrderIndex");
        console.log(currentOrderIndex);
        testArray2[currentOrderIndex] = currentOrder;
      }
    });

    //TODO make sure that the MUI table is correctly displayed
    openOrdersItem4 = <OpenOrdersTable dataOpenOrder={testArray2} />;

    //TODO look into what that is
    console.log("updatedStatusOrder");
    console.log(updatedStatusOrder);
    dispatch(openOrdersActions.updateLatestOrderState(updatedStatusOrder));
  }

  return (
    <div className="mb-20">
      <div className="text-xl font-bold mb-10 items-center underline mt-10">
        Open Orders Overview
      </div>

      <div className="flex flex-col items-center">{openOrdersItem4}</div>
    </div>
  );
};

export default OpenOrders;
