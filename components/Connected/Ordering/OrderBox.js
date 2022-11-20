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

const OrderBox = () => {
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [tokenTicker0, setTokenTicker0] = useState("WETH");
  const [tokenTicker1, setTokenTicker1] = useState("DAI");
  const [minBid, setMinBid] = useState(0);
  const [maxBid, setMaxBid] = useState(0);
  const [tokenAmount0, setTokenAmount0] = useState();
  const [tokenAmount1, setTokenAmount1] = useState();
  const [lastAmountInput, setLastAmountInput] = useState();

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
  const amount0Input = useInput(checkValidity);
  const maxLimInput = useInput(checkValidity);
  const minLimInput = useInput(checkValidity);
  const amount1Input = useInput(checkValidity);

  const amount0InputClasses = amount0Input.hasError
    ? "form-control invalid"
    : "form-control";
  const amount1InputClasses = amount1Input.hasError
    ? "form-control invalid"
    : "form-control";
  const minLimInputClasses = minLimInput.hasError
    ? "form-control invalid"
    : "form-control";
  const maxLimInputClasses = maxLimInput.hasError
    ? "form-control invalid"
    : "form-control";

  let formIsValid = false;
  if (
    amount0Input.enteredInputisValid &&
    minLimInput.enteredInputisValid &&
    amount1Input.enteredInputisValid &&
    maxLimInput.enteredInputisValid &&
    tokenTicker0 != "" &&
    tokenTicker1 != "" &&
    minLimInput.enteredInput < maxLimInput.enteredInput
  ) {
    formIsValid = true;
  }

  useEffect(() => {
    if (formIsValid) {
      const newBids = {
        minBid: minLimInput.enteredInput,
        maxBid: maxLimInput.enteredInput,
      };
      dispatch(limitActions.updateBids(newBids));
    }
  }, [minLimInput.enteredInput, maxLimInput.enteredInput]);

  //interact with SC
  useEffect(() => {
    if (isWeb3Enabled) {
      //updateUI();
    }
  }, [isWeb3Enabled]);

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
    const userLimitInput = {
      token0: {
        ticker0: tokenTicker0,
        amount0: amount0Input.enteredInput,
      },
      token1: {
        ticker1: tokenTicker1,
        amount1: amount1Input.enteredInput,
      },
      maxLimit: maxLimInput.enteredInput,
      minLimit: minLimInput.enteredInput,
      wallet: "",
    };

    //TODO update store (display users last session transaction? )
    //TODO call SC functions with enteredInput

    const createOrderArgs = {
      side: "",
      tickLower: 0,
      tickUpper: 0,
      quantity: 0,
    };

    const outputFee = (await getEntranceFee()).toString();
    console.log("outputFee");
    console.log(outputFee);

    //for state changing tx
    /*
    await enterRaffle({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
    */

    amount0Input.resetInput();
    minLimInput.resetInput();
    maxLimInput.resetInput();
    amount1Input.resetInput();
  };

  const amountUserInput0Handler = (event) => {
    amount0Input.inputChangeHandler(event);
    const currentInput = amount0Input.enteredInput;
    console.log("amount0Input.enteredInput");
    console.log(amount0Input.enteredInput);
    const token0Ratio = limitStore.token0Ratio;

    setTokenAmount1(currentInput * token0Ratio);
  };
  console.log("amount0Input.enteredInput2");
  console.log(amount0Input.enteredInput);

  //compute tokenAmount1
  useEffect(() => {
    const currentInput = amount0Input.enteredInput;
    const token0Ratio = limitStore.token0Ratio;

    setLastAmountInput("token0");
    setTokenAmount1(currentInput * token0Ratio);
  }, [amount0Input.enteredInput]);

  let token0AmountInputFiled;
  if (lastAmountInput === "token0") {
    token0AmountInputFiled = amount0Input.enteredInput;
  } else if (tokenAmount0 > 0) {
    token0AmountInputFiled = tokenAmount0;
  } else {
    token0AmountInputFiled = "";
  }

  //compute tokenAmount0
  useEffect(() => {
    const currentInput = amount1Input.enteredInput;
    const token1Ratio = limitStore.token1Ratio;

    setLastAmountInput("token1");
    setTokenAmount0(currentInput * token1Ratio);
  }, [amount1Input.enteredInput]);

  let token1AmountInputFiled;
  if (lastAmountInput === "token1") {
    token1AmountInputFiled = amount1Input.enteredInput;
  } else if (tokenAmount1 > 0) {
    token1AmountInputFiled = tokenAmount1;
  } else {
    token1AmountInputFiled = "";
  }

  return (
    <div className="">
      <form
        onSubmit={onSubmitHandler}
        className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10"
      >
        <div className="text-center font-bold text-lg mb-14">Limit Orders</div>
        <div className="flex flex-col">
          <div
            className={`${amount0InputClasses} flex flex-row justify-between gap-x-12 `}
          >
            <button onClick={onVisibleHandlerToken0}>
              {tokenTicker0 != "" ? tokenTicker0 : "Select Token"}
            </button>
            {isVisibleToken0 && (
              <SelectToken0
                onClose={onCloseHandlerToken0}
                onSelect={onSelectHandler0}
              />
            )}
            <input
              type="number"
              onChange={amount0Input.inputChangeHandler}
              onBlur={amount0Input.inputBlurHandler}
              value={token0AmountInputFiled}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
          <div
            className={`${amount1InputClasses} flex flex-row justify-between  gap-x-12`}
          >
            <button onClick={onVisibleHandlerToken1}>
              {tokenTicker1 != "" ? tokenTicker1 : "Select Token"}
            </button>
            {isVisibleToken1 && (
              <SelectToken1
                onClose={onCloseHandlerToken1}
                onSelect={onSelectHandler1}
              />
            )}
            <input
              type="number"
              onChange={amount1Input.inputChangeHandler}
              onBlur={amount1Input.inputBlurHandler}
              value={token1AmountInputFiled}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
          <div
            className={`${minLimInputClasses} flex flex-row justify-between gap-x-12`}
          >
            <label className="">Min limit bid</label>
            <input
              type="text"
              onChange={minLimInput.inputChangeHandler}
              onBlur={minLimInput.inputBlurHandler}
              value={minLimInput.enteredInput}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
          <div
            className={`${maxLimInputClasses} flex flex-row justify-between gap-x-12`}
          >
            <label className="">Max limit bid</label>
            <input
              type="number"
              onChange={maxLimInput.inputChangeHandler}
              onBlur={maxLimInput.inputBlurHandler}
              value={maxLimInput.enteredInput}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
        </div>
        <div className="flex justify-around mt-8">
          <button
            type="submit"
            disabled={!formIsValid}
            className={` bg-teal-500 text-white ${
              !formIsValid
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-brownRed hover:font-bold hover:scale-110"
            } border-2 rounded-lg border-white  py-1 px-4 `}
          >
            Create Order
          </button>
        </div>
      </form>
      <TokenRatio4 />
    </div>
  );
};

export default OrderBox;
