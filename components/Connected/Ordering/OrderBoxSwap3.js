import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

const OrderBoxSwap2 = () => {
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
      <div className="text-lg font-bold">Swap</div>
      <div className="mt-6">This feature is under construction</div>
      <div className="mt-12 underline ">More to come!</div>
    </div>
  );
};

export default OrderBoxSwap2;

/*
  
  */
