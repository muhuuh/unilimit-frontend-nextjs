import React, { useState, useEffect } from "react";
import useInput from "../../../hooks/use-input";
import useModal from "../../../hooks/use-modal";
import { contractAddresses, abi, tokens } from "../../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import TokenRatio4 from "../../../pages/TokenRatio4";
import { useDispatch, useSelector } from "react-redux";
import DropdownIcon from "../../UI/Icons/DropdownIcon";
import { openOrdersActions } from "../../store/openOrders-slice";
import { ethers } from "ethers";
import SelectPair from "../Tokens/SelectPair";
import { limitPairActions } from "../../store/limitPair-slice";
//import { EvmChain } from "@moralisweb3/evm-utils";

const OrderBoxLimit2 = () => {
  //------------- set up constants -------------

  const [setSell, setSetSell] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState(null);
  const [contractAddressPool, setContractAddressPool] = useState(
    "0xe0b4c2BAa33258Ca354E65Bee66f9A15045A7F6d"
  );
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
    Moralis,
  } = useMoralis(); //authenticate: https://github.com/MoralisWeb3/react-moralis#usemoralis
  const [pairInfo, setPairInfo] = useState({
    selectedPair: "USDC/WETH",
    token0: {
      ticker: "USDC",
      decimals: 6,
    },
    token1: {
      ticker: "WETH",
      decimals: 18,
    },
  });
  const token0Address = tokens[pairInfo.token0.ticker].token_address;
  const token1Address = tokens[pairInfo.token1.ticker].token_address;
  useEffect(() => {
    if (!isAuthenticated) {
      authenticate();
    }
  }, [isAuthenticated]);

  //TODO import the loading feature from moralis and put the loadingspinenr when refreshin price
  const chainId = parseInt(chainIdHex).toString();

  //------------- set up Modal -------------

  const {
    isVisible: isVisiblePair,
    onCloseHandler: onClosePairHandler,
    onVisibleHandler: onVisiblePairHandler,
  } = useModal();

  //------------- Get token from UI and update store -------------

  const onSelectTradingPairHandler = (selectedPair) => {
    const newPairInfo = {
      selectedPair: selectedPair,
      token0: {
        ticker: contractAddresses[selectedPair].pair.token0,
        decimals: contractAddresses[selectedPair].decimals.token0,
      },
      token1: {
        ticker: contractAddresses[selectedPair].pair.token1,
        decimals: contractAddresses[selectedPair].decimals.token1,
      },
    };
    setPairInfo(newPairInfo);
    dispatch(limitPairActions.updateTicker(newPairInfo));

    const contractAddress = contractAddresses[selectedPair].chain[chainId][0];
    setContractAddressPool(contractAddress);
  };

  //------------- Check if input form is valid -------------
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
    pairInfo.token0.ticker != "" &&
    pairInfo.token1.ticker != "" &&
    quantityLimInput.enteredInput > 0 &&
    priceLimInput.enteredInput > 0
  ) {
    formIsValid = true;
  }

  //------------- refresh address/pair when user select other token -------------

  useEffect(() => {
    if (formIsValid) {
      const newLimitOrderPriQua = {
        quantity: quantityLimInput.enteredInput,
        price: priceLimInput.enteredInput,
      };
      dispatch(limitPairActions.updatePriQua(newLimitOrderPriQua));
    }
  }, [quantityLimInput.enteredInput, priceLimInput.enteredInput]);

  //------------- Function for interaction with smart contract -------------

  //sqrtPriceX96
  const computedPairPrice =
    (1 / limitStore.price) *
    ((10 ^ pairInfo.token1.decimals) / (10 ^ pairInfo.token0.decimals));
  const sqrtPriceX96 = Math.sqrt(computedPairPrice) * 2 ** 96;
  const sqrtPriceX96String = sqrtPriceX96.toLocaleString("fullwide", {
    useGrouping: false,
  });

  //Quantity
  let quantityDecimals;
  if (limitStore.side) {
    quantityDecimals = pairInfo.token0.decimals;
  } else {
    quantityDecimals = pairInfo.token1.decimals;
  }
  const quantityParseUnits = ethers.utils.parseUnits(
    limitStore.quantity.toString(),
    quantityDecimals
  );
  const quantityString = quantityParseUnits.toLocaleString("fullwide", {
    useGrouping: false,
  });

  //change spender from user to contractaddress
  async function approve() {
    const options = {
      contractAddress: token1Address,
      functionName: "approve",
      abi: [
        {
          constant: false,
          inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        _spender: contractAddressPool,
        _value: "10000000000000000000000000000000",
      },
    };
    await Moralis.executeFunction(options);
  }

  /*
  async function allowance() {
    const options = {
      contractAddress: token1Address,
      functionName: "allowance",
      abi: [
        {
          constant: true,
          inputs: [
            { name: "_owner", type: "address" },
            { name: "_spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      params: {
        _owner: account,
        _spender: contractAddressPool,
      },
    };
    await Moralis.executeFunction(options);
  }
  */

  const { runContractFunction: allowance } = useWeb3Contract({
    abi: [
      {
        constant: true,
        inputs: [
          { name: "_owner", type: "address" },
          { name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    contractAddress: token1Address,
    functionName: "allowance",
    params: {
      _owner: account,
      _spender: contractAddressPool,
    },
  });

  const createOrderArgs = {
    side: limitStore.side,
    sqrtPriceX96: sqrtPriceX96String,
    quantity: quantityString,
  };

  const { runContractFunction: createOrder } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddressPool,
    functionName: "createOrder",
    params: createOrderArgs,
  });

  const onBuyHandler = () => {
    setSetSell(false);
    dispatch(limitPairActions.updateSide(false));
  };

  const onSellHandler = () => {
    setSetSell(true);
    dispatch(limitPairActions.updateSide(true));
  };

  const onApproveHandler = async () => {
    console.log("function approved called");
    await approve({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error approve order");
        console.log(error);
      },
    });
  };

  let allowanceTx;
  const onAllowanceHandler = async () => {
    console.log("function allowance called");
    allowanceTx = await allowance({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error approve order");
        console.log(error);
      },
    });
    console.log("allowance from handler");
    setCurrentAllowance(allowanceTx);
    console.log(allowanceTx.toString());
  };

  const onCreateOrderHandler = async () => {
    console.log("function create order called");
    await createOrder({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error createorder");
        console.log(error);
      },
    });
  };

  //------------- UI response from SC call -------------

  useEffect(() => {
    if (isWeb3Enabled) {
      //updateUI();
    }
  }, [isWeb3Enabled]);

  const onHandleSuccess = async (tx) => {
    console.log("onHandleSuccess called");
    //await tx.wait(1);
    console.log("onHandleSuccess");
    onHandleNotification(tx);
    //updateUI();
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

  //------------- Submit entered input and call SC function -------------
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    //check allowance
    await onAllowanceHandler();

    //approve if allowance is null
    if (!allowanceTx) {
      const txApprove = await onApproveHandler();
      console.log("approved");
      console.log(txApprove);
    } else {
      console.log("Allowance sufficient");
    }

    //create Order
    const txCreate = await onCreateOrderHandler();
    //await txCreate.wait(1);
    console.log("order created");

    //TODO If creating  through SC successful, then update openorder store with dispatch function addNewOpenOrder
    const newOpenOrder = {
      id: Math.round(Math.random() * 100),
      wallet: account,
      contractAddress: contractAddressPool,
      pairKey: pairInfo.selectedPair,
      status: "active",
      side: setSell,
      quantity: quantityLimInput.enteredInput,
      priceTarget: priceLimInput.enteredInput,
    };
    dispatch(openOrdersActions.addOpenOrder(newOpenOrder));

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
                onClick={onVisiblePairHandler}
                className="flex flex-row justify-center items-center border-2 rounded-lg shadow hover:scale-110 py-1 px-4 "
              >
                {pairInfo.selectedPair != ""
                  ? pairInfo.selectedPair
                  : "Select Pair"}
                <DropdownIcon />
              </button>
              {isVisiblePair && (
                <SelectPair
                  onClose={onClosePairHandler}
                  onSelect={onSelectTradingPairHandler}
                />
              )}
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
          <div className="flex flex-row justify-center">
            <div
              onClick={onBuyHandler}
              className={` text-white border-2 rounded-l-lg border-white ${
                setSell == false
                  ? "bg-lightGreen font-bold scale-110"
                  : "bg-buyGreen"
              } shadow hover:font-bold hover:scale-110 w-20 py-1 px-2 `}
            >
              Buy
            </div>
            <div
              onClick={onSellHandler}
              className={`text-white border-2 rounded-r-lg border-white ${
                setSell == true
                  ? "bg-brightRedLight font-bold scale-110 "
                  : "bg-darkRed"
              } shadow hover:font-bold hover:scale-110 w-20 py-1 px-2 `}
            >
              {" "}
              Sell
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-grayishBlue hover:bg-paleGrayishBlue hover:border-black hover:text-black"
              } border-2 rounded-lg border-white py-1 px-2 mt-8`}
              disabled={!formIsValid}
            >
              Create Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderBoxLimit2;

/*
            <div className="mb-6">
              <div>Current Ratio on Uniswap: </div>
              <TokenRatio4 />
            </div>

*/