import React, { useEffect, useState } from "react";
import { scrapingCreated } from "./Scraping/ScrapingCreated";
import { scrapingClosed } from "./Scraping/ScrapingClosed";
import { scrapingQuantity } from "./Scraping/ScrapingQuantity";
import { openOrdersActions } from "../components/store/openOrders-slice";
import { addressPairPool } from "../constants";
import { useMoralis } from "react-moralis";
import { useDispatch } from "react-redux";
import { scrapingSettled } from "./Scraping/ScrapingSettled";

const ScrapingMain = () => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const dispatch = useDispatch();
  const [newQuantitiesOrders, setNewQuantitiesOrders] = useState([]);
  const [newClosedOrders, setNewClosedOrders] = useState([]);
  const [newSettledOrders, setNewSettledOrders] = useState([]);
  const [newScrapedOrders, setNewScrapedOrders] = useState([
    {
      pool: "",
      positionId: 0,
      trader: "",
      side: false,
      sqrtPriceX96: 0,
      quantity: 0,
      signature: "",
    },
  ]);

  //--------------- scrape CREATED orders -----------------
  //screape created data
  let scrapedOrders;
  useEffect(() => {
    const scrapeData = async () => {
      scrapedOrders = await scrapingCreated();
      setNewScrapedOrders(scrapedOrders);
    };
    scrapeData();
  }, []);

  const pairAddresses = addressPairPool[chainId];

  //when created data is scraped, we make some modification to it before sending it to the store
  useEffect(() => {
    let newScrapedOrderWithTicker = [];
    newScrapedOrders.map((order) => {
      let pair;
      try {
        pair = pairAddresses[order.pool];
      } catch {
        pair = "none";
      }
      order = { ...order, pair: pair };
      newScrapedOrderWithTicker.push(order);
    });
    dispatch(
      openOrdersActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
    );
  }, [newScrapedOrders]);

  //--------------- scrape CLOSED orders -----------------

  let scrapedClosedOrders;
  useEffect(() => {
    const scrapeDataClosed = async () => {
      scrapedClosedOrders = await scrapingClosed();
      setNewClosedOrders(scrapedClosedOrders);
    };
    scrapeDataClosed();
  }, []);

  console.log("newClosedOrders");
  console.log(newClosedOrders);

  useEffect(() => {
    dispatch(openOrdersActions.updateClosedIds(newClosedOrders));
  }, [newClosedOrders]);

  //--------------- scrape QUANTITY orders -----------------

  let scrapednewQuantities;
  useEffect(() => {
    console.log("useeffect new quantites scrapping");
    const scrapeDataQuantity = async () => {
      scrapednewQuantities = await scrapingQuantity();
      setNewQuantitiesOrders(scrapednewQuantities);
    };
    scrapeDataQuantity();
  }, []);

  console.log("newQuantitiesOrders");
  console.log(newQuantitiesOrders);

  useEffect(() => {
    dispatch(openOrdersActions.updateQuantityOrders(newQuantitiesOrders));
  }, [newQuantitiesOrders]);

  //--------------- scrape SETTLED orders -----------------

  let scrapedSettledOrders;
  useEffect(() => {
    const scrapeDataSettled = async () => {
      scrapedSettledOrders = await scrapingSettled();
      setNewSettledOrders(scrapedSettledOrders);
    };
    scrapeDataSettled();
  }, []);

  console.log("newSettledOrders");
  console.log(newSettledOrders);

  useEffect(() => {
    dispatch(openOrdersActions.updateSettledOrders(newSettledOrders));
  }, [newSettledOrders]);

  return <div></div>;
};

export default ScrapingMain;
