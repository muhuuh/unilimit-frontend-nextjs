import React, { use } from "react";
import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";

const TokenRatio2 = () => {
  const DAI = new Token(
    ChainId.MAINNET,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18
  );

  // note that you may want/need to handle this async code differently,
  // for example if top-level await is not an option
  const pair = use(Fetcher.fetchPairData(DAI, WETH[DAI.chainId]));

  const route = new Route([pair], WETH[DAI.chainId]);

  console.log(route.midPrice.toSignificant(6)); // 201.306
  const ratio0 = route.midPrice.toSignificant(6);
  console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756
  const ratio1 = route.midPrice.invert().toSignificant(6);
  return (
    <div>
      <div>{ratio0}</div>
    </div>
  );
};

export default TokenRatio2;
