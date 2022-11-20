import React from "react";
import TradeViewChart from "react-crypto-chart";
const PriceChart = () => {
  return (
    <div>
      {" "}
      <TradeViewChart pair="BTCBUSD" />
    </div>
  );
};

export default PriceChart;
