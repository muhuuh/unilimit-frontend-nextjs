//const { ethers } = require("ethers");
import { ethers } from "ethers";
import abiUSDT from "./constants/abiUSDT.json" assert { type: "json" };
import abiWBTC from "./constants/abiWBTC.json" assert { type: "json" };
import abiUnilimitGoerli from "./constants/abiUnilimitGoerli.json" assert { type: "json" };
import contractAddress from "./constants/contractAddress.json" assert { type: "json" };
//import { abiUSDT } from "../constants/index";
//const { abiUSDT } = require("./constants");
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log("currentBlock");
  console.log(currentBlock);
  console.log("----------------------------------");

  const iface = new ethers.utils.Interface(abiUnilimitGoerli);
  console.log("Getting Logs ...");
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0xbf67515a38ee520223d32c1266d52101c30d936ed1f3e436c8caeb0a43cb06bf", // Close(uint256 positionId)
      //"0x6c40f5ef74fd79b0dad7fa3da61f0a6a8ef8bf63b75eae10782c62baa2baf1bb", //Open(uint256,address,bool,uint160,uint256)
    ],
  });
  console.log("logs");
  console.log(logs);
  /*
  const decodedEvents = logs.map((log) => iface.parseLog(log));
  console.log("decodedEvents");
  console.log(decodedEvents);
  */
  const decodedEvents = logs.map((log) => {
    const contract = log.address;
    const decodedEvent = iface.parseLog(log);
    return { contract: contract, decodedEventLogs: decodedEvent };
  });
  console.log("----------------------------------");
  console.log("decodedEvents");
  console.log(decodedEvents[0].contract);
  console.log(decodedEvents[0].decodedEventLogs);
  console.log(decodedEvents[0].decodedEventLogs["args"]["trader"]);

  console.log("----------------------------------");

  const contractPool = decodedEvents.map((event) => event.contract);
  const positionId = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["positionId"].toString()
  );

  console.log("positionId");
  console.log(positionId);

  const scrapedClosedOrders = [];
  for (let i = 0; i < positionId.length; i++) {
    let newOrder = {
      pool: contractPool[i],
      positionId: positionId[i],
    };
    scrapedClosedOrders.push(newOrder);
  }
  console.log("----------------------------------");
  console.log("scrapedClosedOrders");
  console.log(scrapedClosedOrders);
  return scrapedClosedOrders;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
