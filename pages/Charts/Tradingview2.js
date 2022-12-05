import Script from "next/script";
import React, { useEffect, useState } from "react";

const Tradingview2 = () => {
  const [script, setScript] = useState();
  const tradingView = {
    //autosize: true,
    width: 980,
    height: 980,
    symbol: "UNISWAP:WETHUSDT",
    interval: "240",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview_ae5bb",
  };

  useEffect(() => {
    setScript(
      <div className="h-96">
        <Script
          type="text/javascript"
          className="h-96"
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
    <div class="tradingview-widget-container">
      <div id="tradingview_ae5bb"></div>
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
      <div className="h-96 bg-red-500">
        <Script
          type="text/javascript"
          className="h-96"
          src="https://s3.tradingview.com/tv.js"
          //strategy="afterInteractive"
          onLoad={() => {
            new TradingView.widget(tradingView);
          }}
        />
      </div>
      <div>test</div>
    </div>
  );
};

export default Tradingview2;
