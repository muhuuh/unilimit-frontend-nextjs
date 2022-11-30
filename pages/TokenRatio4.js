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
  const onRefreshHandler = () => {
    //TODOreset input value to ""
    setRefresh(refresh + 1);
  };

  //get the current pair of token
  //const currentPair = [limitStore.token0Ticker, limitStore.token1Ticker];

  const currentPair = [
    limitStore.pairInfo.token0.ticker,
    limitStore.pairInfo.token1.ticker,
  ];
  console.log("currentPair");
  console.log(currentPair);
  const totalTokens = tokensMainnet;
  console.log("tokens");
  console.log(tokensMainnet[currentPair[0]]);

  useEffect(() => {
    setIsFetching(true);
    const uniToken0 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[0]].token_address,
      totalTokens[currentPair[0]].decimals
    );
    setTokenUni0(uniToken0);
    const uniToken1 = new Token(
      ChainId.MAINNET,
      totalTokens[currentPair[1]].token_address,
      totalTokens[currentPair[1]].decimals
    );
    setTokenUni1(uniToken1);

    //Fetcher.fetchPairData(uniToken0, uniToken1).then((data) => setPair(data));

    Fetcher.fetchPairData(uniToken0, uniToken1)
      .then((data) => setPair(data))
      .then(() => setIsFetching(false));
  }, [refresh]);

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
    <div className="my-6">
      {!isFetching && (
        <div className="my-6">{`${tokenRatio.token0} / ${tokenRatio.token1}`}</div>
      )}
      {isFetching && fetchElement}
      <button
        onClick={onRefreshHandler}
        className="border-2 rounded-lg shadow text-sm py-1 px-4  hover:scale-110"
      >
        Refresh
      </button>
    </div>
  );
};

export default TokenRatio;
