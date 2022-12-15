import React, { useState, useEffect } from "react";
import useInput from "../../../hooks/use-input";
import useModal from "../../../hooks/use-modal";
import { contractAddresses, abi, tokens } from "../../../constants";
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import TokenRatio4 from "../../../pages/TokenRatio4";
import { useDispatch, useSelector } from "react-redux";
import DropdownIcon from "../../UI/Icons/DropdownIcon";
import { openOrdersActions } from "../../store/openOrders-slice";
import { ethers } from "ethers";
import SelectPair from "../Tokens/SelectPair";
import { limitPairActions } from "../../store/limitPair-slice";
import { useNotification } from "web3uikit";

const OrderBoxLimit2 = () => {
  //------------- set up constants -------------

  const [setSell, setSetSell] = useState(false);
  const [contractAddressPool, setContractAddressPool] = useState(
    "0x9e5d7582fbc36d1366fc1f113f400ee3175b4bc2"
  );
  const dispatch = useDispatch();
  const dispatchNotif = useNotification();
  const limitStore = useSelector((state) => state.limit);
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
    Moralis,
  } = useMoralis(); //authenticate: https://github.com/MoralisWeb3/react-moralis#usemoralis
  const contractProcessor = useWeb3ExecuteFunction();
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
    (10 ** pairInfo.token1.decimals / 10 ** pairInfo.token0.decimals);
  const sqrtPriceX96 = Math.sqrt(computedPairPrice) * 2 ** 96;
  const sqrtPriceX96String = sqrtPriceX96.toLocaleString("fullwide", {
    useGrouping: false,
  });

  //Quantity
  //TODO quantity entered in the input value doesn't match the one in the conract on etherscan. look again at computation
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
    //await Moralis.executeFunction(options);
    const res = await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("approving successful");
      },
      onError: (error) => {
        console.log("error in approval", error);
      },
    });
    console.log("res");
    console.log(res);
    return res;
  }

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

  let positionId;
  const onCreateOrderHandler = async () => {
    console.log("function create order called");
    positionId = await createOrder({
      onSuccess: (tx) =>
        tx.wait(1).then((finalTx) => {
          console.log("on handle success...");
          console.log(finalTx);
          onHandleNotification(finalTx);
          console.log("done");
        }),
      onError: (error) => {
        console.log("error createorder");
        console.log(error);
      },
    });
    console.log("positionId");
    console.log(positionId);
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

  const onHandleNotification = (tx) => {
    dispatchNotif({
      type: "success",
      //status: success,
      message: `Order creation successful to ${tx.to}`,
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
    //TODO make sure that allowance runs before the rest of the code continues
    //check allowance
    const allowanceTx = await allowance();
    console.log("allowance read");
    console.log(allowanceTx);
    //console.log(allowanceTx.toNumber());
    const convertedAllowance = ethers.utils.formatEther(allowanceTx);
    console.log("convertedAllowance");
    console.log(convertedAllowance);

    //approve if allowance is null
    //if (convertedAllowance > 10000) {
    if (true) {
      console.log("no allowance");
      const approvalTx = await approve();
      const approvalTxResult = await approvalTx.wait();
      if (approvalTxResult.status !== 1) {
        throw new Error("Failed approval");
      }
      console.log("approved");
    } else {
      console.log("Allowance sufficient");
    }

    //create Order
    const createTx = await onCreateOrderHandler();
    //const createTxResult = await createTx.wait();
    //await txCreate.wait(1);
    console.log("order created");

    //TODO make sure to wait for suucesful creation order before submitting (will also give a correct)
    const newOpenOrder = {
      pair: pairInfo.selectedPair,
      positionId: positionId.value.toString(),
      trader: account,
      pool: contractAddressPool,
      status: "active",
      side: setSell,
      sqrtPriceX96: priceLimInput.enteredInput,
      quantity: quantityLimInput.enteredInput,
      signature: "",
    };

    /*
    if (positionId[value].toString() != "0") {
      dispatch(openOrdersActions.addOpenOrder(newOpenOrder));
    }
    */
    //TODO make sure it either refresh scraping, or adds to the openorder store
    dispatch(openOrdersActions.addOpenOrder(newOpenOrder));

    quantityLimInput.resetInput();
    priceLimInput.resetInput();
  };

  return (
    <div className="">
      <form
        onSubmit={onSubmitHandler}
        className=" mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10"
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
            <div className="mb-6">
              <div>Current Ratio on Uniswap: </div>
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
