import { useEffect, useState } from "react";
import UniswapV3 from "@uniswap/v3-sdk";

export const useUniswapV3 = () => {
  const [uniswap, setUniswap] = useState(null);

  useEffect(() => {
    (async () => {
      const provider = new UniswapV3.Provider();
      const instance = new UniswapV3(provider);
      setUniswap(instance);
    })();
  }, []);

  return uniswap;
};
