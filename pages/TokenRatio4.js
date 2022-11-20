import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { limitActions } from "../components/store/limit-slice";
import { tokens } from "../constants";

//https://nextjs.org/docs/basic-features/data-fetching/client-side
//https://nextjs.org/docs/basic-features/data-fetching/overview
//https://beta.nextjs.org/docs/data-fetching/fetching

const TokenRatio = () => {
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const [tokenRatio, setTokenRatio] = useState({});
  const [pair, setPair] = useState("");

  //get the current pair of token
  const currentPair = [limitStore.token0Ticker, limitStore.token1Ticker];
  console.log("currentPair");
  console.log(currentPair);
  const totalTokens = tokens;
  console.log("totalTokens pair 0");
  console.log(totalTokens[currentPair[0]].address);
  console.log("totalTokens pair 1");
  console.log(totalTokens[currentPair[1]].address);

  const uniToken0 = new Token(
    ChainId.MAINNET,
    totalTokens[currentPair[0]].address,
    totalTokens[currentPair[0]].decimals
  );
  console.log("uniToken0");
  console.log(uniToken0);
  const uniToken1 = new Token(
    ChainId.MAINNET,
    totalTokens[currentPair[1]].address,
    totalTokens[currentPair[1]].decimals
  );
  console.log("uniToken1");
  console.log(uniToken1);
  //TODO make sure we fetch the price correctly for different unisawp token pairs

  const [refresh, setRefresh] = useState(0);
  const onRefreshHandler = () => {
    //TODOreset input value to ""
    setRefresh(refresh + 1);
  };

  const DAI = new Token(
    ChainId.MAINNET,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18
  );

  useEffect(() => {
    const uniToken0 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[0]].address,
      totalTokens[currentPair[0]].decimals
    );
    const uniToken1 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[1]].address,
      totalTokens[currentPair[1]].decimals
    );
    console.log("fetch new pair");
    Fetcher.fetchPairData(uniToken0, uniToken1).then((data) => setPair(data));
  }, [refresh]);

  useEffect(() => {
    if (pair == "") {
      return;
    } else {
      const route = new Route([pair], uniToken0);

      const ratio0 = route.midPrice.toSignificant(6);
      const ratio1 = route.midPrice.invert().toSignificant(6);
      const newRatio = { token0: ratio0, token1: ratio1 };
      setTokenRatio(newRatio);
      console.log("newRatio");
      console.log(newRatio);
      dispatch(limitActions.updateRatio(newRatio));
    }
  }, [pair]);

  return (
    <div className="mt-2">
      <div className="mb-2">{`${tokenRatio.token0}`}</div>
      <button
        onClick={onRefreshHandler}
        className="border-2 rounded-lg text-sm py-1 px-4"
      >
        Refresh Price
      </button>
    </div>
  );
};

export default TokenRatio;
