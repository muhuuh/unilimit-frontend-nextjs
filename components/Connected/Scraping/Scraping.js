import { ethers } from "ethers";
//import abi from "./constants/abi.json" assert { type: "json" };
import abi from "../../../constants/abi.json" assert { type: "json" };
//import contractAddress from "./constants/contractAddress.json" assert { type: "json" };
import contractAddress from "../../../constants/contractAddress.json" assert { type: "json" };

import * as dotenv from "dotenv";
import { useDispatch } from "react-redux";
import { scrapingActions } from "../../store/scraping-slice";
dotenv.config();

async function scraping() {
  const dispatch = useDispatch();
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log("currentBlock");
  console.log(currentBlock);
  console.log("----------------------------------");

  const iface = new ethers.utils.Interface(abi);
  console.log("Getting Logs ...");
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x6c40f5ef74fd79b0dad7fa3da61f0a6a8ef8bf63b75eae10782c62baa2baf1bb", //Open(uint256,address,bool,uint160,uint256)
    ],
  });
  console.log("logs");
  console.log(logs);
  const decodedEvents = logs.map((log) => iface.parseLog(log));
  console.log("decodedEvents");
  console.log(decodedEvents);

  console.log("----------------------------------");

  const positionId = decodedEvents.map((event) =>
    event["args"]["positionId"].toString()
  );
  const trader = decodedEvents.map((event) => event["args"]["trader"]);
  const side = decodedEvents.map((event) => event["args"]["side"]);
  const sqrtPriceX96 = decodedEvents.map(
    (event) => event["args"]["sqrtPriceX96"]
  );
  const quantity = decodedEvents.map((event) =>
    event["args"]["quantity"].toString()
  );
  const signature = decodedEvents.map((event) => event["signature"].toString());
  console.log("positionId");
  console.log(positionId);
  console.log("trader");
  console.log(trader);
  console.log("side");
  console.log(side);
  console.log("sqrtPriceX96");
  console.log(sqrtPriceX96);
  console.log("quantity");
  console.log(quantity);
  console.log("signature");
  console.log(signature);

  const scrapedOrders = [];
  for (let i = 0; i < positionId.length; i++) {
    let newOrder = {
      positionId: positionId[i],
      trader: trader[i],
      side: side[i],
      sqrtPriceX96: sqrtPriceX96[i],
      quantity: quantity[i],
      signature: signature[i],
    };
    scrapedOrders.push(newOrder);
  }
  console.log("----------------------------------");
  console.log("scrapedOrders");
  console.log(scrapedOrders);
  dispatch(scrapingActions.updateScrapingOpenOrders(scrapedOrders));
}

module.exports = {
  scraping,
};

/*
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
*/
