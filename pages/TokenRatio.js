import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { limitPairActions } from "../components/store/limitPair-slice";
import { tokensMainnet } from "../constants";
import LoadingSpinner from "../components/UI/LoadingSpinner";

//https://nextjs.org/docs/basic-features/data-fetching/client-side
//https://nextjs.org/docs/basic-features/data-fetching/overview
//https://beta.nextjs.org/docs/data-fetching/fetching

const TokenRatio = () => {
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const [tokenRatio, setTokenRatio] = useState({});
  const [pair, setPair] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [tokenUni0, setTokenUni0] = useState();
  const [tokenUni1, setTokenUni1] = useState();
  const [isFetching, setIsFetching] = useState(false);

  //get the current pair of token
  //const currentPair = [limitStore.token0Ticker, limitStore.token1Ticker];
  console.log("raaatiioooo");

  const currentPair = [
    limitStore.pairInfo.token0.ticker,
    limitStore.pairInfo.token1.ticker,
  ];
  console.log("currentPair");
  console.log(currentPair);
  const totalTokens = tokensMainnet;
  console.log("tokens");
  console.log(tokensMainnet[currentPair[0]]);

  let uniToken0, uniToken1;
  useEffect(() => {
    setIsFetching(true);
    uniToken0 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[0]].token_address,
      totalTokens[currentPair[0]].decimals
    );
    setTokenUni0(uniToken0);
    uniToken1 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[1]].token_address,
      totalTokens[currentPair[1]].decimals
    );
    setTokenUni1(uniToken1);

    //Fetcher.fetchPairData(uniToken0, uniToken1).then((data) => setPair(data));

    Fetcher.fetchPairData(uniToken0, uniToken1)
      .then((data) => setPair(data))
      .then(() => setIsFetching(false));
  }, [uniToken0, uniToken1]);

  /*
  if (isFetching) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  */
  const fetchElement = (
    <div className="flex justify-center items-center my-4">
      <LoadingSpinner />
    </div>
  );

  useEffect(() => {
    if (pair == "") {
      return;
    } else {
      const route = new Route([pair], tokenUni0);

      const ratio0 = route.midPrice.toSignificant(6);
      const ratio1 = route.midPrice.invert().toSignificant(6);
      const newRatio = { token0: ratio0, token1: ratio1 };
      setTokenRatio(newRatio);
      console.log("newRatio");
      console.log(newRatio);
      dispatch(limitPairActions.updateRatio(newRatio));
    }
  }, [pair]);

  return (
    <span className="text-sm text-gray-600 text-left mt-2">
      {!isFetching && <span className="">{` ${tokenRatio.token1}`}</span>}
      {isFetching && fetchElement}
    </span>
  );
};

export default TokenRatio;
