import React, { useEffect, useState } from "react";
import { scrapingCreated } from "./Scraping/ScrapingCreated";
import { scrapingClosed } from "./Scraping/ScrapingClosed";
import { scrapingQuantity } from "./Scraping/ScrapingQuantity";
import { openOrdersActions } from "../components/store/openOrders-slice";
import { addressPairPool } from "../constants";
import { useMoralis } from "react-moralis";
import { useDispatch } from "react-redux";

const ScrapingMain = () => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  const dispatch = useDispatch();
  const [newQuantitiesOrders, setNewQuantitiesOrders] = useState([]);
  const [newClosedOrders, setNewClosedOrders] = useState([]);
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

  //--------------- scrape CREATED orders -----------------
  let scrapedOrders;
  useEffect(() => {
    console.log("useeffect scrapping");
    const scrapeData = async () => {
      scrapedOrders = await scrapingCreated();
      setNewScrapedOrders(scrapedOrders);
    };
    scrapeData();
  }, []);

  const pairAddresses = addressPairPool[chainId];

  useEffect(() => {
    console.log("run second useeffect");

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
      //scrapingActions.updateScrapingOpenOrders(newScrapedOrderWithTicker)
    );
  }, [newScrapedOrders]);

  //--------------- scrape CLOSED orders -----------------

  let scrapedClosedOrders;
  useEffect(() => {
    console.log("useeffect closed scrapping");
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

  return <div></div>;
};

export default ScrapingMain;
