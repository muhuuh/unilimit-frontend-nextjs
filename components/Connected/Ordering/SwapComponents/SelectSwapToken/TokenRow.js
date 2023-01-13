import React from "react";
import { useDispatch } from "react-redux";
import { swapPairActions } from "../../../../store/swapPair-slice";

const TokenRow = (props) => {
  const dispatch = useDispatch();
  const onSelectionHandler = () => {
    const tokenInfo = {
      ticker: props.ticker,
      name: props.name,
      token_address: props.token_address,
      decimals: props.decimals,
    };
    if (props.tokenNumber == 0) {
      console.log("token 0 selected");
      console.log(tokenInfo);
      dispatch(swapPairActions.updateSwapToken0(tokenInfo));
    } else if (props.tokenNumber == 1) {
      console.log("token 1 selected");
      console.log(tokenInfo);
      dispatch(swapPairActions.updateSwapToken1(tokenInfo));
    } else {
      console.log("token selected unclear");
    }
    props.onClose();
  };
  return (
    <div
      onClick={onSelectionHandler}
      className="flex flex-row justify-between border-b-2 cursor-pointer"
    >
      <div>{props.ticker}</div>
      <div>{props.name}</div>
    </div>
  );
};

export default TokenRow;
