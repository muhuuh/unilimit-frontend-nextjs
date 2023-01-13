import React, { useState, useEffect } from "react";
import useInput from "../../../hooks/use-input";
import useModal from "../../../hooks/use-modal";
import { contractAddresses, abi, tokens, ERC20abi } from "../../../constants";
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import TokenRatio from "../../../pages/TokenRatio";
import { useDispatch, useSelector } from "react-redux";
import DropdownIcon from "../../UI/Icons/DropdownIcon";
import { openOrdersActions } from "../../store/openOrders-slice";
import { ethers } from "ethers";
import SelectPair from "../Tokens/SelectPair";
import { limitPairActions } from "../../store/limitPair-slice";
import { useNotification } from "web3uikit";
import { Rocket } from "@web3uikit/icons";

const OrderBoxLimit = () => {
  //-------Define variables-----------
  const currentPoolAddress = contractAddresses["USDC/WETH"].chain["5"][0];
  //const { getContract0, getContract1 } = AlphaRouterService();
  const [contract0, setContract0] = useState(undefined);
  const [contract1, setContract1] = useState(undefined);
  const [amount0, setamount0] = useState(undefined);
  const [amount1, setamount1] = useState(undefined);
  const [setSell, setSetSell] = useState(false);

  const [contractAddressPool, setContractAddressPool] =
    useState(currentPoolAddress);
  const dispatch = useDispatch();
  const dispatchNotif = useNotification();
  const limitStore = useSelector((state) => state.limit);
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
    web3,
  } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  //Default pair is USDC/WETH. State of the pair info can be changed by the user
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
  const chainId = parseInt(chainIdHex).toString();
  useEffect(() => {}, [pairInfo]);
  const token0Address = tokens[pairInfo.token0.ticker].token_address;
  const token1Address = tokens[pairInfo.token1.ticker].token_address;

  console.log("isAuthenticated limit");
  console.log(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      authenticate();
      console.log("isAuthenticated limit2");
      console.log(isAuthenticated);
    }
  }, []);

  //------------- Set up Modal to select token-------------

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

  //------------- Check if input form for quantity and price is valid -------------
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

  //------------- Refresh price/quantity data in the store when user enters values -------------

  useEffect(() => {
    if (formIsValid) {
      const newLimitOrderPriQua = {
        quantity: quantityLimInput.enteredInput,
        price: priceLimInput.enteredInput,
      };
      dispatch(limitPairActions.updatePriQua(newLimitOrderPriQua));
    }
  }, [quantityLimInput.enteredInput, priceLimInput.enteredInput]);

  //------------- Define functions for interaction with smart contract -------------

  //convert entered price to sqrtPriceX96
  const computedPairPrice =
    (1 / limitStore.price) *
    (10 ** pairInfo.token1.decimals / 10 ** pairInfo.token0.decimals);
  const sqrtPriceX96 = Math.sqrt(computedPairPrice) * 2 ** 96;
  const sqrtPriceX96String = sqrtPriceX96.toLocaleString("fullwide", {
    useGrouping: false,
  });

  //Convert entered quantity
  let quantityDecimals;
  if (limitStore.side) {
    quantityDecimals = pairInfo.token1.decimals;
  } else {
    quantityDecimals = pairInfo.token0.decimals;
  }

  const quantityParseUnits = ethers.utils.parseUnits(
    limitStore.quantity.toString(),
    quantityDecimals
  );
  const quantityString = quantityParseUnits.toLocaleString("fullwide", {
    useGrouping: false,
  });

  //converted user input to be used when calling smart contract functions
  const createOrderArgs = {
    side: limitStore.side,
    sqrtPriceX96: sqrtPriceX96String,
    quantity: quantityString,
  };
  console.log("createOrderArgs");
  console.log(createOrderArgs);

  //user input whetehr sell or buy
  const onBuyHandler = () => {
    setSetSell(false);
    dispatch(limitPairActions.updateSide(false));
  };

  const onSellHandler = () => {
    setSetSell(true);
    dispatch(limitPairActions.updateSide(true));
  };

  //get balances of selected tokens

  let tickerBalanceToken, tickerBalance;
  if (setSell) {
    tickerBalanceToken = pairInfo.token1.ticker;
    tickerBalance = amount1;
  } else {
    tickerBalanceToken = pairInfo.token0.ticker;
    tickerBalance = amount0;
  }

  const getContract0 = () => new ethers.Contract(token0Address, ERC20abi, web3);
  const getContract1 = () => new ethers.Contract(token1Address, ERC20abi, web3);

  useEffect(() => {
    const onLoad = async () => {
      const contract0 = getContract0();
      console.log("contract0");
      console.log(contract0);
      setContract0(contract0);

      const contract1 = getContract1();
      setContract1(contract1);
    };
    onLoad();
  }, [pairInfo.token1.ticker, pairInfo.token0.ticker]);

  const getWalletAddress = () => {
    contract0.balanceOf(account).then((res) => {
      setamount0(Number(ethers.utils.formatEther(res)));
    });
    contract1.balanceOf(account).then((res) => {
      setamount1(Number(ethers.utils.formatEther(res)));
    });
  };

  useEffect(() => {
    if (web3.getSigner() !== undefined && contract0 !== undefined) {
      console.log("function signer called");
      getWalletAddress();
    }
  }, [contract0, contract1]);

  // Approve function: change spender from user to contractaddress
  let approveTokenAddress;
  console.log("approve setSell");
  console.log(setSell);
  if (setSell) {
    approveTokenAddress = token1Address;
  } else {
    approveTokenAddress = token0Address;
  }
  async function approve() {
    const options = {
      contractAddress: approveTokenAddress,
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
        _value: "10000000000000000000000000000000000000000000000000000",
      },
    };

    const res = await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("approving successful");
      },
      onError: (error) => {
        console.log("error in approval", error);
      },
    });
    return res;
  }

  // Allowance function: read function to see if allowance has already been set
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
    contractAddress: approveTokenAddress,
    functionName: "allowance",
    params: {
      _owner: account,
      _spender: contractAddressPool,
    },
  });

  const { runContractFunction: createOrder } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddressPool,
    functionName: "createOrder",
    params: createOrderArgs,
  });

  //create order funtion
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
  };

  const onHandleNotification = (tx) => {
    dispatchNotif({
      type: "info",
      message: `Order creation successful to ${tx.to}`,
      title: "Tx notification",
      position: "topR",
      icon: <Rocket fontSize="50px" />,
    });
  };

  //------------- Submit entered input and call create order SC function -------------
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    //check if allowance is sufficient
    const allowanceTx = await allowance();
    const convertedAllowance = ethers.utils.formatEther(allowanceTx);

    if (convertedAllowance < 10000) {
      //if (true) {
      console.log("no allowance");
      const approvalTx = await approve();
      const approvalTxResult = await approvalTx.wait();
      if (approvalTxResult.status !== 1) {
        throw new Error("Failed approval");
      }
    } else {
      console.log("Allowance sufficient");
    }

    //call create Order
    const createTx = await onCreateOrderHandler();
    console.log("order created");

    if (positionId != null) {
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

      dispatch(openOrdersActions.addOpenOrder(newOpenOrder));
    }

    quantityLimInput.resetInput();
    priceLimInput.resetInput();
  };

  return (
    <div className="">
      <form
        onSubmit={onSubmitHandler}
        className=" mt-10 mx-16 border-2 rounded-xl shadow-md px-24 py-10"
      >
        <div className="text-center font-bold text-lg mb-8">Limit Orders</div>
        <div className="flex flex-row justify-center mb-8">
          <div
            onClick={onBuyHandler}
            className={` text-white border-2 rounded-l-lg border-white ${
              setSell == false
                ? "bg-buyGreen font-bold scale-110"
                : "bg-gray-600"
            } shadow hover:font-bold hover:scale-110 w-20 py-1 px-2 `}
          >
            Buy
          </div>
          <div
            onClick={onSellHandler}
            className={`text-white border-2 rounded-r-lg border-white ${
              setSell == true
                ? "bg-darkRed font-bold scale-110 "
                : "bg-gray-600"
            } shadow hover:font-bold hover:scale-110 w-20 py-1 px-2 `}
          >
            {" "}
            Sell
          </div>
        </div>
        <div className="">
          <div className="border-b-2 mb-6">
            <div className="flex flex-row justify-around mb-6">
              <button
                onClick={onVisiblePairHandler}
                className="flex flex-row justify-center items-center  py-1 px-4 "
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
          <div className="">
            <div className={`${quantityLimInputClasses} `}>
              <input
                type="number"
                placeholder="Quantity"
                onChange={quantityLimInput.inputChangeHandler}
                onBlur={quantityLimInput.inputBlurHandler}
                value={quantityLimInput.enteredInput}
                className="bg-gray-100 h-14 rounded-lg py-2 px-3 text-gray-800"
              />
              <div className="text-sm text-gray-600 text-left mt-2">
                {`Balance ${tickerBalanceToken}:  ${tickerBalance?.toFixed(3)}`}
              </div>
            </div>
            <div className={`${priceLimInputClasses} `}>
              <input
                type="number"
                placeholder="Target Price"
                onChange={priceLimInput.inputChangeHandler}
                onBlur={priceLimInput.inputBlurHandler}
                value={priceLimInput.enteredInput}
                className="bg-gray-100 h-14 rounded-lg py-2 px-3 text-gray-800"
              />
              <div className="text-left  mt-2">
                <span className="text-sm text-gray-600">Current Ratio:</span>
                <TokenRatio />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-grayishBlue hover:bg-paleGrayishBlue hover:border-black hover:text-black"
              } border-2 rounded-lg border-white py-1 px-2 mt-2`}
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

export default OrderBoxLimit;
