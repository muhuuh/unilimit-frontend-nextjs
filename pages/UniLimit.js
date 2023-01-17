import React from "react";
import { useMoralis } from "react-moralis";
import Connected from "../components/Connected/Connected";
import NotConnected from "../components/NotConnected/NotConnected";

const UniLimit = () => {
  const { isWeb3Enabled, isAuthenticated } = useMoralis();
  return (
    <div className="text-center ">
      {isWeb3Enabled ? <Connected /> : <NotConnected />}
    </div>
  );
};

export default UniLimit;
