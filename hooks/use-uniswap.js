import { useEffect, useState } from "react";
import UniswapV3 from "@uniswap/v3-sdk";
import { useMoralis } from "react-moralis";

export const useUniswapV3 = () => {
  const [uniswap, setUniswap] = useState(null);
  const { web3 } = useMoralis();

  useEffect(() => {
    if (!web3 || !web3.currentProvider) {
      return;
    }

    (async () => {
      const provider = new UniswapV3.Provider(web3.currentProvider);
      const instance = new UniswapV3(provider);
      setUniswap(instance);
    })();
  }, [web3]);

  return uniswap;
};
