import React, { useEffect, useState } from "react";
import { scraping } from "../../../pages/Scraping/Scraping";
import { openOrdersActions } from "../../components/store/openOrders-slice";

const ScrapingMain = () => {
  const [newScrapedOrders, setNewScrapedOrders] = useState([
    {
      pool: "",
      positionId: "",
      trader: "",
      side: "",
      sqrtPriceX96: "",
      quantity: "",
      signature: "",
    },
  ]);
  let scrapedOrders;
  useEffect(() => {
    console.log("useeffect scrapping");
    const scrapeData = async () => {
      scrapedOrders = await scraping();
      setNewScrapedOrders(scrapedOrders);
    };
    scrapeData();
  }, []);

  const pairAddresses = addressPairPool[chainId];

  useEffect(() => {
    console.log("run second useeffect");
    let newScrapedOrderWithTicker = [];
    newScrapedOrders.map((order) => {
      const pair = pairAddresses[order.pool];
      order = { ...order, pair: pair };
      newScrapedOrderWithTicker.push(order);
    });
    dispatch(
      openOrdersActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
      //scrapingActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
    );
  }, [newScrapedOrders]);
  return <div></div>;
};

export default ScrapingMain;
