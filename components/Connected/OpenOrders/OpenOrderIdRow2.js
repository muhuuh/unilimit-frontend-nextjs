import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useModal from "../../../hooks/use-modal";
import { openOrdersActions } from "../../store/openOrders-slice";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, addressPairPool } from "../../../constants";

const OpenOrderIdRow2 = (props) => {
  const [contractAddressPool, setContractAddressPool] = useState(
    "0x9e5d7582fbc36d1366fc1f113f400ee3175b4bc2"
  );
  const { chainId: chainIdHex, account, Moralis } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const dispatch = useDispatch();
  const {
    isVisible: isVisibleModify,
    onCloseHandler: onCloseHandlerModify,
    onVisibleHandler: onVisibleHandlerModify,
  } = useModal();

  console.log("props.pool");
  console.log(props.pool);

  const { runContractFunction: closePositionOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: props.pool,
    functionName: "closePositionOwner",
    params: { positionId: props.id }, //TODOget the current id from props. fetching should put in it store and the get from parent compoent
  });

  const onCloseOrderHandler = async () => {
    //TODO call SC function to close the order
    console.log("closingorderhandler called");
    closePositionOwner({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error closing order");
        console.log(error);
      },
    });
    dispatch(openOrdersActions.closeOpenOrder(props.id));
  };

  const onHandleSuccess = async (tx) => {
    console.log("Close Order succesful");
    onHandleNotification(tx);
  };

  const onHandleNotification = () => {
    dispatch({
      type: "info",
      message: "transaction completed",
      title: "Tx notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="flex flex-row justify-between items-center w-2/3 border-b-2">
      <div>{props.id}</div>
      <div>{props.status}</div>
      <div>{props.pair}</div>
      <div>{props.side}</div>
      <div>{props.quantity}</div>
      <div>{props.priceTarget}</div>
      <div className="my-2">
        <button
          onClick={onVisibleHandlerModify}
          className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
        >
          Change
        </button>
        {isVisibleModify && (
          <ChangeAmountPopup onClose={onCloseHandlerModify} id={props.id} />
        )}
      </div>
      <div className="my-2">
        <button
          onClick={onCloseOrderHandler}
          className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OpenOrderIdRow2;
