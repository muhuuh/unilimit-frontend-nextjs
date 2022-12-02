import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenOrderIdRow from "./OpenOrderIdRow";
import OpenOrderIdRow2 from "./OpenOrderIdRow2";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { useMoralis } from "react-moralis";
import { scraping } from "../../../pages/Scraping/Scraping";
import { scrapingActions } from "../../store/scraping-slice";
import { addressPairPool, contractAddresses } from "../../../constants";
import { openOrdersActions } from "../../store/openOrders-slice";

const OpenOrders = () => {
  const scrapingsStore = useSelector((state) => state.scraping);
  const openOrderStore = useSelector((state) => state.openOrders);
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const dispatch = useDispatch();
  const [refreshScraping, setRefreshScraping] = useState(0);
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
  //TODO get data from scraping function and upload to store
  /*
  let scrapedOrders;
  useEffect(() => {
    console.log("useeffect scrapping");
    const scrapeData = async () => {
      scrapedOrders = await scraping();
      setNewScrapedOrders(scrapedOrders);
    };
    scrapeData();
  }, [refreshScraping]);

  const pairAddresses = addressPairPool[chainId];

  useEffect(() => {
    console.log("run second useeffect");
    let newScrapedOrderWithTicker = [];
    const test = newScrapedOrders.map((order) => {
      const pair = pairAddresses[order.pool];
      order = { ...order, pair: pair };
      newScrapedOrderWithTicker.push(order);
    });
    dispatch(
      openOrdersActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
      //scrapingActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
    );
  }, [newScrapedOrders]);

  */
  let openOrdersItem2;
  if (openOrderStore.openOrders.length > 0) {
    //openOrdersItem2 = scrapingsStore.openOrders.map((order) => (
    openOrdersItem2 = openOrderStore.openOrders.map((order) => (
      <OpenOrderIdRow2
        id={order.positionId}
        status="status"
        pool={order.pool}
        pair={order.pair}
        side={order.side}
        quantity={order.quantity}
        priceTarget={order.sqrtPriceX96}
        priceCurrent="none"
      />
    ));
  }

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
        {openOrdersItem2}
      </div>
    </div>
  );
};

export default OpenOrders;
