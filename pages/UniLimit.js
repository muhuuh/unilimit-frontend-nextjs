import React from "react";
import { useMoralis } from "react-moralis";
import Connected from "../components/Connected/Connected";
import NotConnected from "../components/NotConnected/NotConnected";

const UniLimit = () => {
  const { isWeb3Enabled } = useMoralis();
  return (
    <div className="text-center ">
      <div className="text-xl font-bold mb-10 items-center">Welcome!</div>
      {isWeb3Enabled ? <Connected /> : <NotConnected />}
    </div>
  );
};

export default UniLimit;
