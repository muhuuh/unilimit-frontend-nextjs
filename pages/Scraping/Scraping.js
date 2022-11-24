//const { ethers } = require("ethers");
import { ethers } from "ethers";
import abiUSDT from "./constants/abiUSDT.json" assert { type: "json" };
import abiWBTC from "./constants/abiWBTC.json" assert { type: "json" };
import contractAddress from "./constants/contractAddress.json" assert { type: "json" };
//import { abiUSDT } from "../constants/index";
//const { abiUSDT } = require("./constants");
import * as dotenv from "dotenv";
dotenv.config();

//https://medium.com/linum-labs/everything-you-ever-wanted-to-know-about-events-and-logs-on-ethereum-fec84ea7d0a5

async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log(currentBlock);
  console.log("----------------------------------");

  const iface = new ethers.utils.Interface(abiWBTC);
  const events = iface.events;
  console.log("events");
  console.log(events);
  const transfer = events["Transfer(address,address,uint256)"];
  console.log("transfer");
  console.log(transfer);
  const eventTopic = transfer.topic;
  const logs = await provider.getLogs({
    fromBlock: "0xF4AE5C",
    toBlock: "latest",
    address: contractAddress.WBTC,
    //fromBlock: ethers.utils.hexlify(currentBlock - 2),
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ],
  });
  const decodedEvents = logs.map((log) => iface.parseLog(log));

  const toAddresses = decodedEvents.map((event) => event["args"]["to"]);
  const fromAddresses = decodedEvents.map((event) => event["args"]["from"]);
  const amounts = decodedEvents.map((event) =>
    event["args"]["value"].toString()
  );
  const signature = decodedEvents.map((event) => event["signature"]);
  console.log("toAddresses");
  console.log(toAddresses);
  console.log("fromAddresses");
  console.log(fromAddresses);
  console.log("amounts");
  console.log(amounts);
  console.log("signature");
  console.log(signature);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
