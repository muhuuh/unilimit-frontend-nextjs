//const { ethers } = require("ethers");
import { ethers } from "ethers";
import abiUSDT from "./constants/abiUSDT.json" assert { type: "json" };
import abiWBTC from "./constants/abiWBTC.json" assert { type: "json" };
import contractAddress from "./constants/contractAddress.json" assert { type: "json" };
//import { abiUSDT } from "../constants/index";
//const { abiUSDT } = require("./constants");
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const iface = new ethers.utils.Interface(abiUSDT);
  console.log("keys");
  console.log(process.env.INFURA_API_KEY);
  //const provider = ethers.getDefaultProvider("mainnet", {alchemy: process.env.ALCHEMY_API_KEY ?? "",});

  const provider = new ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log("----------------------------------");
  console.log(currentBlock);
  console.log("----------------------------------");

  const logs = await provider.getLogs({
    address: contractAddress.WBTC,
    //fromBlock: ethers.utils.hexlify(currentBlock - 2),
    fromBlock: "0xF4ADA8",
    toBlock: "latest",
  });

  console.log(logs);
  console.log("----------------------------------");
  /*
  const decodedEvents = logs.map((log) => {
    iface.decodeEventLog("Transfer", log.data);
  });
  console.log("decodedEvents");
  console.log(decodedEvents);
  console.log("----------------------------------");
  const toAddresses = decodedEvents.map((event) => event["values"]["to"]);
  const fromAddresses = decodedEvents.map((event) => event["values"]["from"]);
  const amounts = decodedEvents.map((event) => event["values"]["value"]);
  console.log("toAddresses");
  console.log(toAddresses);
  */
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
