import { useEffect, useState } from "react";
import UniswapV3 from "@uniswap/v3-sdk";
import { useMoralis } from "react-moralis";

export const useUniswapV3 = () => {
  const [uniswap, setUniswap] = useState(null);
  const { web3 } = useMoralis();
  console.log("UniswapV3: ", UniswapV3);

  useEffect(() => {
    console.log("web3 in hook");
    console.log(web3);
    if (!web3 || !web3.provider) {
      console.log("hook doesn't work");
      return;
    }
    console.log("hook doesn't work2");
    console.log(web3.provider);

    (async () => {
      const provider = new UniswapV3.Provider(web3.provider);
      console.log("provider");
      console.log(provider);
      const instance = new UniswapV3(provider);
      setUniswap(instance);
    })();
  }, [web3]);

  return uniswap;
};
