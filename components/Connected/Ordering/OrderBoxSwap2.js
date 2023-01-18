import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import GearIcon from "../../UI/Icons/GearIcon";
import ConfigModal from "./SwapComponents/ConfigModal";
import CurrencyField from "./SwapComponents/CurrencyField";
import AlphaRouterService from "./SwapComponents/AlphaRouterService";
import useModal from "../../../hooks/use-modal";
import { useSelector } from "react-redux";

const OrderBoxSwap2 = () => {
  const { getContract0, getContract1, getPrice, runSwap } =
    AlphaRouterService();
  const { isVisible, onCloseHandler, onVisibleHandler } = useModal();
  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [contract0, setContract0] = useState(undefined);
  const [contract1, setContract1] = useState(undefined);
  const [amount0, setamount0] = useState(undefined);
  const [amount1, setamount1] = useState(undefined);
  const [disabled, setDisabled] = useState(true);
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
    user,
    web3,
  } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const swapStore = useSelector((state) => state.swap);
  const token0 = swapStore.token0;
  console.log("check store token0");
  console.log(token0.ticker);

  useEffect(() => {
    if (!isAuthenticated) {
      authenticate();
    }
  }, [isAuthenticated]);

  //const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  //const [signerAddress, setSignerAddress] = useState(undefined);

  useEffect(() => {
    const onLoad = async () => {
      //const provider = await new ethers.providers.Web3Provider(window.ethereum);
      //setProvider(provider);
      const contract0 = getContract0();
      console.log("contract0");
      console.log(contract0);
      setContract0(contract0);

      const contract1 = getContract1();
      setContract1(contract1);
    };
    onLoad();
  }, [swapStore.token0.ticker, swapStore.token1.ticker]);

  const getSigner = async () => {
    const signer = web3.getSigner();
    setSigner(signer);
  };
  const isConnected = () => web3.getSigner() !== undefined;
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

  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    const swap = getPrice(
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      account
    ).then((data) => {
      setTransaction(data[0]);
      setOutputAmount(data[1]);
      setRatio(data[2]);
      setLoading(false);
    });
  };

  const disabledHandler = (disableStatus) => {
    setDisabled(!disableStatus);
  };

  return (
    <div className="h-[38rem] justify-center mt-10 mx-24 border rounded-xl shadow-md px-14 py-10 bg-zigzagBlueDark">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-center text-gray-100">
          Swap
        </span>
        <span className="cursor-pointer" onClick={onVisibleHandler}>
          <GearIcon />
        </span>
        {isVisible && (
          <ConfigModal
            onClose={onCloseHandler}
            setDeadlineMinutes={setDeadlineMinutes}
            deadlineMinutes={deadlineMinutes}
            setSlippageAmount={setSlippageAmount}
            slippageAmount={slippageAmount}
          />
        )}
      </div>
      <div className="flex flex-col gap-y-4 px-4 pt-10">
        <p className="text-left text-gray-400">From</p>
        <CurrencyField
          className="mb-3"
          field="input"
          ticker={swapStore.token0.ticker}
          getSwapPrice={getSwapPrice}
          signer={signer}
          balance={amount0}
          tokenNumber={0}
          disabledHandler={disabledHandler}
        />
        <p className="text-left text-gray-400">To </p>
        <CurrencyField
          className="mb-3"
          field="output"
          ticker={swapStore.token1.ticker}
          value={outputAmount}
          signer={signer}
          balance={amount1}
          loading={loading}
          tokenNumber={1}
        />
      </div>
      <div className="px-4 py-3 text-gray-400">
        {ratio && (
          <>{`1 ${swapStore.token1.ticker} = ${ratio} ${swapStore.token0.ticker}`}</>
        )}
      </div>

      <div className="px-4 py-3">
        {isConnected() ? (
          <button
            className={`text-white ${
              disabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            } py-2 px-4 rounded-lg`}
            onClick={() => runSwap(transaction, signer)}
          >
            Swap
          </button>
        ) : (
          <button
            className={`text-white ${
              disabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            } py-2 px-4 rounded-lg`}
            onClick={() => getSigner(web3)}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderBoxSwap2;

/*
  
  */
