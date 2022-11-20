import React from "react";

const PriceChart2 = () => {
  return (
    <div>
      <div class="tradingview-widget-container">
        <div id="tradingview_f56b4"></div>
        <div class="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener"
            target="_blank"
          >
            <span class="blue-text">AAPL Chart</span>
          </a>{" "}
          by TradingView
        </div>
        <script type="module" src="https://s3.tradingview.com/tv.js"></script>
        <script type="module">
          {
            new TradingView.widget({
              autosize: true,
              symbol: "NASDAQ:AAPL",
              interval: "D",
              timezone: "Etc/UTC",
              theme: "light",
              style: "1",
              locale: "en",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: "tradingview_f56b4",
            })
          }
          ;
        </script>
      </div>
    </div>
  );
};

export default PriceChart2;
