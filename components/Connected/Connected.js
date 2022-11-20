import React from "react";
//import ReactTradingviewWidget from "react-tradingview-widget";
import OrderBox from "./Ordering/OrderBox";
import PriceChart2 from "./PriceCharts/PriceChart2";

const Connected = () => {
  //Look into getting all transaction from wallet based on indexed events and display them
  return (
    <div className="">
      <div className="flex  justify-center">
        <OrderBox />
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default Connected;
//<ReactTradingviewWidget symbol="NASDAQ:AAPL" />
