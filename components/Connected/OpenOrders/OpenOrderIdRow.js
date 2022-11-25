import React from "react";
import { useDispatch } from "react-redux";
import useModal from "../../../hooks/use-modal";
import { openOrdersActions } from "../../store/openOrders-slice";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";

const OpenOrderIdRow = (props) => {
  const dispatch = useDispatch();
  const {
    isVisible: isVisibleModify,
    onCloseHandler: onCloseHandlerModify,
    onVisibleHandler: onVisibleHandlerModify,
  } = useModal();

  const onCloseOrderHandler = () => {
    //TODO call SC function to close the order
    //TODO TODO if successful, then dispatch to the store
    dispatch(openOrdersActions.closeOpenOrder(props.id));
  };
  return (
    <div className="flex flex-row justify-between items-center w-2/3 border-b-2">
      <div>{props.id}</div>
      <div>{props.status}</div>
      <div>{props.pair}</div>
      <div>{props.side}</div>
      <div>{props.quantity}</div>
      <div>{props.priceTarget}</div>
      <div>{props.priceCurrent}</div>
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

export default OpenOrderIdRow;
