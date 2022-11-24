import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenOrderIdRow from "./OpenOrderIdRow";
import { contractAddresses } from "../../../constants";
import { useMoralis } from "react-moralis";
import { openOrdersActions } from "../../store/openOrders-slice";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";

const OpenOrders = () => {
  const openOrdersStore = useSelector((state) => state.openOrders);
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const dispatch = useDispatch();
  const pairKeys = Object.keys(contractAddresses);

  //update open Orders on UI with matched keys from the contract/pool

  useEffect(() => {
    let pairKey = [];
    const keyPairsObject = {};
    let tempAddress;
    openOrdersStore.openOrders.map((order) => {
      tempAddress = order.contractAddress;
      let index;
      pairKeys.map((key) => {
        if (contractAddresses[key][chainId][0] === tempAddress) {
          console.log("key found");
          console.log(key);
          pairKey.push(key);
        }
      });
      index = pairKey.length - 1;
      keyPairsObject[index] = pairKey[index];
    });
    console.log("keyPairsObject");
    console.log(keyPairsObject);
    console.log("pairKey");
    console.log(pairKey);
    dispatch(openOrdersActions.updatepairKey(keyPairsObject));
  }, [openOrdersStore]);

  //call the getterfunction from the server side component and upload to store there
  const openOrdersItem = openOrdersStore.openOrders.map((order) => (
    <OpenOrderIdRow
      id={order.id}
      status={order.status}
      pair={order.pairKey}
      side={order.side}
      quantity={order.quantity}
      priceTarget={order.priceTarget}
      priceCurrent={order.priceCurrent}
    />
  ));
  console.log(openOrdersItem);

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
        {openOrdersItem}
      </div>
      <ChangeAmountPopup />
    </div>
  );
};

export default OpenOrders;
