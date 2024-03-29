import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { limitPairActions } from "../components/store/limitPair-slice";
import { tokensMainnet } from "../constants";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { BeatLoader } from "react-spinners";

//https://nextjs.org/docs/basic-features/data-fetching/client-side
//https://nextjs.org/docs/basic-features/data-fetching/overview
//https://beta.nextjs.org/docs/data-fetching/fetching

const TokenRatio = (props) => {
  const dispatch = useDispatch();
  const limitStore = useSelector((state) => state.limit);
  const [tokenRatio, setTokenRatio] = useState({});
  const [pair, setPair] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [tokenUni0, setTokenUni0] = useState();
  const [tokenUni1, setTokenUni1] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [sellSide, setSellSide] = useState(false);
  const [showRatio, setShowRatio] = useState(0);

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
    console.log("currentPair useeffect");
    console.log(currentPair);
  }, [limitStore.pairInfo]);

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
  }, [limitStore.pairInfo, totalTokens]);

  useEffect(() => {
    console.log("props.side useeffect");
    if (props.side) {
      setSellSide(true);
    } else {
      setSellSide(false);
    }
  }, [props.side]);

  useEffect(() => {
    if (sellSide) {
      setShowRatio(tokenRatio.token1);
    } else {
      setShowRatio(tokenRatio.token0);
    }
  }, [sellSide, tokenRatio]);

  const fetchElement = (
    <span className="ml-4">
      <BeatLoader color="#36d7b7" size={8} margin={3} />
    </span>
  );

  useEffect(() => {
    if (pair == "") {
      return;
    } else {
      const route = new Route([pair], tokenUni0);

      const ratio0 = route.midPrice.toSignificant(5);
      const ratio1 = route.midPrice.invert().toSignificant(5);
      const newRatio = { token0: ratio0, token1: ratio1 };
      setTokenRatio(newRatio);
      console.log("newRatio");
      console.log(newRatio);
      setShowRatio(tokenRatio.token0);
      dispatch(limitPairActions.updateRatio(newRatio));
    }
  }, [pair]);

  console.log("showRatio");
  console.log(showRatio);
  return (
    <span className="text-sm text-gray-400 text-left mt-2">
      {!isFetching && <span className="">{` ${showRatio}`}</span>}
      {isFetching && fetchElement}
    </span>
  );
};

export default TokenRatio;
