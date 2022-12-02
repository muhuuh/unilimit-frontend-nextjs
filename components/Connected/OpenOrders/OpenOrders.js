import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenOrderIdRow2 from "./OpenOrderIdRow2";
import { useMoralis } from "react-moralis";
import { openOrdersActions } from "../../store/openOrders-slice";

const OpenOrders = () => {
  const openOrderStore = useSelector((state) => state.openOrders.openOrders);
  const closedOrdersIds = useSelector(
    (state) => state.openOrders.closedOrdersId
  );
  const dispatch = useDispatch();

  let openOrdersItem2;
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
      updatedStatusOrder.push(order);
      return (
        <OpenOrderIdRow2
          id={order.positionId}
          status={order.status}
          pool={order.pool}
          pair={order.pair}
          side={order.side}
          quantity={order.quantity}
          priceTarget={order.sqrtPriceX96}
          priceCurrent="none"
        />
      );
    });
    console.log("updatedStatusOrder");
    console.log(updatedStatusOrder);
    dispatch(openOrdersActions.updateLatestOrderState(updatedStatusOrder));
  }

  return (
    <div className="mb-20">
      <div className="font-bold text-lg mb-10">Open Orders Overview</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-between w-2/3 border-b-4">
          <div>ID</div>
          <div>Status</div>
          <div>Pair</div>
          <div>Side</div>
          <div>Quantity</div>
          <div>Target Price</div>
          <div>Adjust size</div>
          <div>Close</div>
        </div>
        {openOrdersItem2}
      </div>
    </div>
  );
};

export default OpenOrders;
