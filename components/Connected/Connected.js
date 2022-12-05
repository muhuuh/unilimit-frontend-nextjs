import React, { useState } from "react";
import Tradingview2 from "../../pages/Charts/Tradingview2";
import OpenOrders from "./OpenOrders/OpenOrders";
import OrderBoxLimit from "./Ordering/OrderBoxLimit";
import OrderBoxLimit2 from "./Ordering/OrderBoxLimit2";
//import ReactTradingviewWidget from "react-tradingview-widget";
import OrderBoxSwap from "./Ordering/OrderBoxSwap";

const Connected = () => {
  const [showLimit, setShowLimit] = useState(true);
  //Look into getting all transaction from wallet based on indexed events and display them
  return (
    <div>
      <div className="flex flex-row justify-center gap-x-20">
        <div>
          <Tradingview2 />
        </div>
        <div>
          <div className="flex flex-row justify-center">
            <button
              onClick={() => setShowLimit(true)}
              className={` border-2 px-4 py-1 rounded-l-lg border-white shadow-md w-20 ${
                showLimit
                  ? "bg-paleGrayishBlue border-black text-black"
                  : "bg-grayishBlue text-white border-white "
              } hover:bg-paleGrayishBlue hover:border-black hover:text-black hover:scale-110`}
            >
              Limit
            </button>
            <button
              onClick={() => setShowLimit(false)}
              className={` border-2 px-4 py-1 rounded-r-lg border-white shadow-md w-20 ${
                !showLimit
                  ? "bg-paleGrayishBlue border-black text-black"
                  : "bg-grayishBlue text-white border-white "
              } hover:bg-paleGrayishBlue hover:border-black hover:text-black hover:scale-110`}
            >
              Swap
            </button>
          </div>
          <div className="flex  justify-center mb-16">
            {showLimit ? <OrderBoxLimit2 /> : <OrderBoxSwap />}
          </div>
        </div>
      </div>
      <div className="">{showLimit ? <OpenOrders /> : <div />}</div>
    </div>
  );
};

export default Connected;
