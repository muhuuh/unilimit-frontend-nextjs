import React from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/use-input";
import { openOrdersActions } from "../../store/openOrders-slice";
import Modal from "../../UI/Modal";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../../constants";

const ChangeAmountPopup = (props) => {
  const dispatch = useDispatch();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  //some entries might stay empty (just getting the current values if emtpy hence now validity check)
  const checkValidity = (input) => {
    return input.trim() !== "";
  };
  const newAmountInput = useInput(checkValidity);
  const newAmountInputClasses = newAmountInput.hasError
    ? "form-control invalid"
    : "form-control";

  let formIsValid = false;
  if (newAmountInput.enteredInputisValid && newAmountInput.enteredInput > 0) {
    formIsValid = true;
  }
  //------------------- run SC functions ----------------

  //get the tokens and decimals for computing the quantity
  let quantityDecimals;
  if (props.side === "true") {
    quantityDecimals = contractAddresses[props.pair].decimals.token0;
  } else {
    quantityDecimals = contractAddresses[props.pair].decimals.token1;
  }

  let quantityString;
  if (newAmountInput.enteredInput > 0) {
    const quantityParseUnits = ethers.utils.parseUnits(
      newAmountInput.enteredInput.toString(),
      quantityDecimals
    );
    quantityString = quantityParseUnits.toLocaleString("fullwide", {
      useGrouping: false,
    });
  }

  //define the SC functions
  const { runContractFunction: increaseSize } = useWeb3Contract({
    abi: abi,
    contractAddress: props.pool,
    functionName: "increaseSize",
    params: { positionId: props.id, quantity: quantityString },
  });

  const { runContractFunction: decreaseSize } = useWeb3Contract({
    abi: abi,
    contractAddress: props.pool,
    functionName: "decreaseSize",
    params: { positionId: props.id, quantity: quantityString },
  });

  const onIncreaseSizeHandler = async () => {
    console.log("closingorderhandler called");
    increaseSize({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error increasing size");
        console.log(error);
      },
    });
    /*
    dispatch(
      openOrdersActions.updateQuantity({
        id: props.id,
        quantity: newAmountInput.enteredInput,
      })
    );
    */
  };

  const onDecreaseSizeHandler = async () => {
    console.log("closingorderhandler called");
    decreaseSize({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error decreasing size");
        console.log(error);
      },
    });
    /*
    dispatch(
      openOrdersActions.updateQuantity({
        id: props.id,
        quantity: newAmountInput.enteredInput,
      })
    );
    */
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

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("submit");

    //TODO put the input value as the current values
    if (!formIsValid) {
      return;
    }

    const newOrderQuantity = {
      id: props.id,
      quantity: newAmountInput.enteredInput,
    };

    if (newAmountInput.enteredInput > props.quantity) {
      onIncreaseSizeHandler();
    } else if (newAmountInput.enteredInput < props.quantity) {
      onDecreaseSizeHandler();
    } else {
      return;
    }

    //TODO check why didn't update
    dispatch(openOrdersActions.updateQuantity(newOrderQuantity));

    props.onClose();
  };

  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSubmitHandler} className="">
        <div className="flex justify-center items-center text-center">
          <div className={` ${newAmountInputClasses}`}>
            <label className="text-lg mt-8">Modify order quantity</label>
            <input
              type="text"
              onChange={newAmountInput.inputChangeHandler}
              onBlur={newAmountInput.inputBlurHandler}
              value={newAmountInput.enteredInput}
              className="border-2 rounded-lg shadow-sm mt-8 h-8 w-48"
            />
          </div>
        </div>
        <div className="flex justify-around mt-8">
          <div>
            <button
              type="submit"
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-buyGreen shadow hover:font-bold hover:scale-110"
              } border-2 rounded-l-lg border-white w-32 py-1 px-2 `}
              disabled={!formIsValid}
            >
              Increase Size
            </button>
            <button
              type="submit"
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-buyGreen shadow hover:font-bold hover:scale-110"
              } border-2 rounded-r-lg border-white w-32 py-1 px-2 `}
              disabled={!formIsValid}
            >
              Decrease Size
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeAmountPopup;
