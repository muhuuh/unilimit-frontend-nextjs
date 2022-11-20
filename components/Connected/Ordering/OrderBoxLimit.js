import React, { useState, useEffect } from "react";
import useInput from "../../../hooks/use-input";
import useModal from "../../../hooks/use-modal";
import SelectToken1 from "../Tokens/SelectToken1";
import SelectToken0 from "../Tokens/SelectToken0";
import { contractAddresses, abi } from "../../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import TokenRatio4 from "../../../pages/TokenRatio4";
import { limitActions } from "../../store/limit-slice";
import { useDispatch, useSelector } from "react-redux";

const OrderBoxLimit = () => {
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [tokenTicker0, setTokenTicker0] = useState("WETH");
  const [tokenTicker1, setTokenTicker1] = useState("DAI");
  const [setSell, setSetSell] = useState(false);
  const [contractAddressPool, setContractAddressPool] = useState("");

  //Modal
  const {
    isVisible: isVisibleToken0,
    onCloseHandler: onCloseHandlerToken0,
    onVisibleHandler: onVisibleHandlerToken0,
  } = useModal();
  const {
    isVisible: isVisibleToken1,
    onCloseHandler: onCloseHandlerToken1,
    onVisibleHandler: onVisibleHandlerToken1,
  } = useModal();

  //Select Token & update tokenticker in store
  const onSelectHandler0 = (tokenTicker) => {
    setTokenTicker0(tokenTicker);
  };
  const onSelectHandler1 = (tokenTicker) => {
    setTokenTicker1(tokenTicker);
  };

  useEffect(() => {
    const newTickers = { token0: tokenTicker0, token1: tokenTicker1 };
    dispatch(limitActions.updateTicker(newTickers));
  }, [tokenTicker0, tokenTicker1]);

  //prepare the input fields/checks, etc
  const checkValidity = (input) => {
    return input.trim() !== "";
  };

  const priceLimInput = useInput(checkValidity);
  const quantityLimInput = useInput(checkValidity);

  const quantityLimInputClasses = quantityLimInput.hasError
    ? "form-control invalid"
    : "form-control";
  const priceLimInputClasses = priceLimInput.hasError
    ? "form-control invalid"
    : "form-control";

  let formIsValid = false;
  if (
    quantityLimInput.enteredInputisValid &&
    priceLimInput.enteredInputisValid &&
    tokenTicker0 != "" &&
    tokenTicker1 != "" &&
    quantityLimInput.enteredInput > 0 &&
    priceLimInput.enteredInput > 0
  ) {
    formIsValid = true;
  }

  useEffect(() => {
    if (formIsValid) {
      const newLimitOrderPriQua = {
        quantity: quantityLimInput.enteredInput,
        price: priceLimInput.enteredInput,
      };
      dispatch(limitActions.updatePriQua(newLimitOrderPriQua));
    }
  }, [quantityLimInput.enteredInput, priceLimInput.enteredInput]);

  //interact with SC
  useEffect(() => {
    if (isWeb3Enabled) {
      //updateUI();
    }
  }, [isWeb3Enabled]);

  //TODO function to get the correct pool/SC contract based on the token pair
  const getcontractAddress = () => {
    setContractAddressPool("");
  };

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: 1000,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const onHandleSuccess = async (tx) => {
    await tx.wait(1);
    onHandleNotification(tx);
    updateUI();
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

  //submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    //TODO check which pool the token pair is to call the correct contract
    //TODO call SC functions with enteredInput

    const createOrderArgs = {
      side: limitStore.side,
      quantity: limitStore.quantity,
      price: limitStore.price,
    };
    console.log("createOrderArgs");
    console.log(createOrderArgs);

    const outputFee = (await getEntranceFee()).toString();
    console.log("outputFee");
    console.log(outputFee);

    quantityLimInput.resetInput();
    priceLimInput.resetInput();
  };

  return (
    <div className="">
      <form
        onSubmit={onSubmitHandler}
        className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10"
      >
        <div className="text-center font-bold text-lg mb-14">Limit Orders</div>
        <div className="">
          <div className="border-b-2 mb-6">
            <div className="flex flex-row justify-around mb-6">
              <button
                onClick={onVisibleHandlerToken0}
                className="border-2 rounded-lg hover:scale-110 py-1 px-4"
              >
                {tokenTicker0 != "" ? tokenTicker0 : "Select Token"}
              </button>
              {isVisibleToken0 && (
                <SelectToken0
                  onClose={onCloseHandlerToken0}
                  onSelect={onSelectHandler0}
                />
              )}
              <button
                onClick={onVisibleHandlerToken1}
                className="border-2 rounded-lg hover:scale-110 py-1 px-4"
              >
                {tokenTicker1 != "" ? tokenTicker1 : "Select Token"}
              </button>
              {isVisibleToken1 && (
                <SelectToken1
                  onClose={onCloseHandlerToken1}
                  onSelect={onSelectHandler1}
                />
              )}
            </div>
            <div className="mb-6">
              <div>Current Price on Uniswap: </div>
              <TokenRatio4 />
            </div>
          </div>
          <div className="flex flex-row gap-x-6">
            <div className={`${quantityLimInputClasses} `}>
              <label className="">Quantity</label>
              <input
                type="text"
                onChange={quantityLimInput.inputChangeHandler}
                onBlur={quantityLimInput.inputBlurHandler}
                value={quantityLimInput.enteredInput}
                className="border-2 rounded-lg shadow-sm h-8 w-48"
              />
            </div>
            <div className={`${priceLimInputClasses} `}>
              <label className="">Price</label>
              <input
                type="number"
                onChange={priceLimInput.inputChangeHandler}
                onBlur={priceLimInput.inputBlurHandler}
                value={priceLimInput.enteredInput}
                className="border-2 rounded-lg shadow-sm h-8 w-48"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                setSetSell(false);
                dispatch(limitActions.updateSide(false));
              }}
              className={` text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-buyGreen hover:font-bold hover:scale-110 "
              } border-2 rounded-l-lg border-white w-20 py-1 px-2 `}
              disabled={!formIsValid}
            >
              Buy
            </button>
            <button
              onClick={() => {
                setSetSell(true);
                dispatch(limitActions.updateSide(true));
              }}
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-darkRed hover:font-bold hover:scale-110"
              } border-2 rounded-r-lg border-white w-20 py-1 px-2 `}
              disabled={!formIsValid}
            >
              {" "}
              Sell
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderBoxLimit;
