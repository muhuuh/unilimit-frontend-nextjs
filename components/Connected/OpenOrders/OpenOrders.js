import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OpenOrderIdRow from "./OpenOrderIdRow";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { scraping } from "../Scraping/Scraping.js";

const OpenOrders = () => {
  const openOrdersStore = useSelector((state) => state.openOrders);
  const scrapingsStore = useSelector((state) => state.scraping);
  const [refreshScraping, setRefreshScraping] = useState(0);
  //TODO get from store the open orders info that were fetched from scraper
  useEffect(async () => {
    console.log("useeffect scrapping");
    await scraping();
  }, [refreshScraping]);

  //call the getterfunction from the server side component and upload to store there
  const openOrdersItem = openOrdersStore.openOrders.map((order) => (
    <OpenOrderIdRow
      id={order.id}
      status={order.status}
      pair={order.pairKey}
      side={order.side}
      quantity={order.quantity}
      priceTarget={order.priceTarget}
      priceCurrent={order.priceCurrent}
    />
  ));
  const scrapedOpenOrders = scrapingsStore.openOrders[0];
  console.log("scrapedOpenOrders");
  console.log(scrapedOpenOrders);

  return (
    <div className="mb-20">
      <div className="font-bold text-lg mb-10">Open Orders Overview</div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-between w-2/3 border-b-4">
          <div>ID</div>
          <div>Status</div>
          <div>Pair</div>
          <div>Side</div>
          <div>Quantity</div>
          <div>Target Price</div>
          <div>Adjust size</div>
          <div>Close</div>
        </div>
        {openOrdersItem}
      </div>
      {}
    </div>
  );
};

export default OpenOrders;
