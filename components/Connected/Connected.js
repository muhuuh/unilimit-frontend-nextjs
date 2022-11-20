import React, { useState } from "react";
import OrderBoxLimit from "./Ordering/OrderBoxLimit";
//import ReactTradingviewWidget from "react-tradingview-widget";
import OrderBoxSwap from "./Ordering/OrderBoxSwap";

const Connected = () => {
  const [showLimit, setShowLimit] = useState(true);
  //Look into getting all transaction from wallet based on indexed events and display them
  return (
    <div className="">
      <div className="flex flex-row justify-center gap-x-10">
        <button onClick={() => setShowLimit(true)}>Limit</button>
        <button onClick={() => setShowLimit(false)}>Swap</button>
      </div>
      <div className="flex  justify-center">
        {showLimit ? <OrderBoxLimit /> : <OrderBoxSwap />}
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default Connected;
