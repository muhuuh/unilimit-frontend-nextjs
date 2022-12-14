import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import GearIcon from "../../UI/Icons/GearIcon";
import ConfigModal from "./SwapComponents/ConfigModal";
import DumpLoader from "react-spinners";
import CurrencyField from "./SwapComponents/CurrencyField";
/*
import AlphaRouterService, {
  getContrat0,
  getContrat1,
  getPrice,
  runSwap,
} from "./SwapComponents/AlphaRouterService";
*/

import AlphaRouterService from "./SwapComponents/AlphaRouterService";

const OrderBoxSwap2 = () => {
  const { getContract0, getContract1, getPrice, runSwap } =
    AlphaRouterService();

  const [showModal, setShowModal] = useState(undefined);
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
      setContract0(contract0);

      const contract1 = getContract1();
      setContract1(contract1);
    };
    onLoad();
  }, []);

  //console.log(provider.getSigner());
  console.log("web3");
  console.log(web3.getSigner());
  console.log("account");
  console.log(account);

  const getSigner = async () => {
    const signer = web3.getSigner();
    setSigner(signer);
  };
  const isConnected = () => signer !== undefined;
  const getWalletAddress = () => {
    /*
    signer.getAddress()
      .then(address => {
        setSignerAddress(address)
    */

    // todo: connect weth and uni contracts
    contract0.balanceOf(account).then((res) => {
      setamount0(Number(ethers.utils.formatEther(res)));
    });
    contract1.balanceOf(account).then((res) => {
      setamount1(Number(ethers.utils.formatEther(res)));
    });

    //})
  };

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
    <div className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10 h-96">
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-sm p-6 bg-white rounded-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-lg font-medium">Swap</span>
            <span className="cursor-pointer" onClick={() => setShowModal(true)}>
              <GearIcon />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>
          <div className="px-4 py-3">
            <CurrencyField
              className="mb-3"
              field="input"
              tokenName="Token0"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={amount0}
            />
            <CurrencyField
              className="mb-3"
              field="output"
              tokenName="Token1"
              value={outputAmount}
              signer={signer}
              balance={amount1}
              spinner={DumpLoader}
              loading={loading}
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
                onClick={() => getSigner(provider)}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBoxSwap2;

/*
  
  */
