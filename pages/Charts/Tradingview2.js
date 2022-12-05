import Script from "next/script";
import React, { useEffect, useState } from "react";

const Tradingview2 = () => {
  const [script, setScript] = useState();
  const tradingView = {
    //autosize: true,
    width: 900,
    height: 630,
    symbol: "UNISWAP:WETHUSDT",
    interval: "240",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview_ae5bb",
  };

  useEffect(() => {
    setScript(
      <div className="">
        <Script
          type="module"
          className=""
          src="https://s3.tradingview.com/tv.js"
          //strategy="afterInteractive"
          onLoad={() => {
            new TradingView.widget(tradingView);
          }}
        />
      </div>
    );
  }, []);

  return (
    <div class="tradingview-widget-container mt-20">
      <div id="tradingview_ae5bb"></div>
      <div class="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
          rel="noopener"
          target="_blank"
        >
          <span class="blue-text">Chart</span>
        </a>{" "}
        by TradingView
      </div>
      <div className="">
        <Script
          type="module"
          className=""
          src="https://s3.tradingview.com/tv.js"
          //strategy="afterInteractive"
          onLoad={() => {
            new TradingView.widget(tradingView);
          }}
        />
      </div>
    </div>
  );
};

export default Tradingview2;
