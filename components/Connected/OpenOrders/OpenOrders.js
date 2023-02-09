import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openOrdersActions } from "../../store/openOrders-slice";
import OpenOrdersTable from "./OpenOrdersTable";
import contractAddresses from "../../../constants/contractAddress.json" assert { type: "json" };

const OpenOrders = () => {
  //-------Define variables-----------
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

  //-------Get scraped open orders from store and modify changed quantity and status-----------
  let openOrdersItem;
  let testArray = [];
  if (openOrderStore.length > 0) {
    //Update closed orders
    let updatedStatusOrder = [];

    openOrderStore.map((order) => {
      if (closedOrdersIds.includes(order.positionId)) {
        order = { ...order, status: "closed" };
      } else {
        order = { ...order, status: "open" };
      }
      testArray.push(order);
      return;
    });

    //update settled orders
    let testArray2 = [];
    testArray.map((order) => {
      if (settledOrdersIds.includes(order.positionId)) {
        order = { ...order, status: "settled" };
      }
      testArray2.push(order);
      return;
    });

    //update changed quantities of open orders
    let loopCount = 0;
    let currentDecimalsQuantity, newCurrentQuantity;
    changedOrdersIds.map((quantityIds) => {
      if (allOrdersIds.includes(quantityIds)) {
        let currentOrder = testArray2.find(
          (order) => order.positionId === quantityIds
        );
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
        currentOrder = {
          ...currentOrder,
          quantity: newCurrentQuantity,
        };
        loopCount++;

        let currentOrderIndex = testArray2.findIndex(
          (order) => order.positionId === quantityIds
        );
        testArray2[currentOrderIndex] = currentOrder;
      }
    });

    //display the data with all updated data from the scrapping scripts
    openOrdersItem = <OpenOrdersTable dataOpenOrder={testArray2} />;
    dispatch(openOrdersActions.updateLatestOrderState(updatedStatusOrder));
  }

  return (
    <div className="mt-10">
      <div className="text-xl font-bold mb-10 items-center text-gray-100">
        Open Orders Overview
      </div>
      <div className=" flex justify-center items-center ">{openOrdersItem}</div>
    </div>
  );
};

export default OpenOrders;
