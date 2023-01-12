import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import GearIcon from "../../UI/Icons/GearIcon";
import ConfigModal from "./SwapComponents/ConfigModal";
import DumpLoader from "react-spinners";
import CurrencyField from "./SwapComponents/CurrencyField";
import AlphaRouterService from "./SwapComponents/AlphaRouterService";
import useModal from "../../../hooks/use-modal";

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
  }, []);

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

  console.log("signer balance");
  console.log(signer);

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

  return (
    <div className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10 ">
      <div className="mx-auto max-w-sm p-6 bg-white rounded-lg ">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xl font-bold text-center">Swap</span>
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
        <div className="flex flex-col gap-y-4 px-4 py-3">
          <CurrencyField
            className="mb-3"
            field="input"
            tokenName="WETH"
            getSwapPrice={getSwapPrice}
            signer={signer}
            balance={amount0}
            tokenNumber={0}
          />
          <CurrencyField
            className="mb-3"
            field="output"
            tokenName="UNI"
            value={outputAmount}
            signer={signer}
            balance={amount1}
            spinner={DumpLoader}
            loading={loading}
            tokenNumber={1}
          />
        </div>
        <div className="px-4 py-3">
          {ratio && <>{`1 UNI = ${ratio} WETH`}</>}
        </div>

        <div className="px-4 py-3">
          {isConnected() ? (
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg"
              onClick={() => runSwap(transaction, signer)}
            >
              Swap
            </button>
          ) : (
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg"
              onClick={() => getSigner(web3)}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBoxSwap2;

/*
  
  */
