import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenOrderIdRow from "./OpenOrderIdRow";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { scraping } from "../../../pages/Scraping/Scraping";
import { scrapingActions } from "../../store/scraping-slice";

const OpenOrders = () => {
  const openOrdersStore = useSelector((state) => state.openOrders);
  const scrapingsStore = useSelector((state) => state.scraping);
  const dispatch = useDispatch();
  const [refreshScraping, setRefreshScraping] = useState(0);
  const [newScrapedOrders, setNewScrapedOrders] = useState(0);
  //TODO get data from scraping function and upload to store
  let scrapedOrders;
  useEffect(() => {
    console.log("useeffect scrapping");
    const scrapeData = async () => {
      scrapedOrders = await scraping();
      setNewScrapedOrders(scrapedOrders);
    };
    scrapeData();
  }, [refreshScraping]);

  useEffect(() => {
    console.log("run second useeffect");
    dispatch(scrapingActions.updateScrapingOpenOrders(newScrapedOrders));
  }, [newScrapedOrders]);

  console.log("scrapingsStore.openOrders");
  console.log(scrapingsStore.openOrders[0]);

  /*
  const openOrdersItem2 = scrapingsStore.openOrders.map((order) => (
    <OpenOrderIdRow
      id={order.positionId}
      status="status"
      pair="pair"
      side={order.side}
      quantity={order.quantity}
      priceTarget={order.sqrtPriceX96}
      priceCurrent="none"
    />
  ));
  */

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
  const scrapedOpenOrders = scrapingsStore.openOrders;
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
    </div>
  );
};

export default OpenOrders;
