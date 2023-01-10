import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import GearIcon from "../../UI/Icons/GearIcon";
import ConfigModal from "./ConfigModal";

const OrderBoxSwap2 = () => {
  const [showModal, setShowModal] = useState(undefined);
  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
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

  /*
  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    };
    onLoad();
  }, []);
  */

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
    wethContract.balanceOf(account).then((res) => {
      setWethAmount(Number(ethers.utils.formatEther(res)));
    });
    uniContract.balanceOf(account).then((res) => {
      setUniAmount(Number(ethers.utils.formatEther(res)));
    });

    //})
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
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
            />
            <CurrencyField
              className="mb-3"
              field="output"
              tokenName="UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
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
