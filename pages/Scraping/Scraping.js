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

//topics
//"0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5", //Open()
//"0x3530a1451b172db538d3a925b0b5d3bd0a25e8c51bb572d53b25248e5921041c", //Decrease()
//"0xc35789ccff76271dc0efa6bfde2f4d4a32cd48dd86278f75f8648cb068c86e3b", //Close()

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
  console.log("iface");
  console.log(iface);
  console.log("contractAddress.UnilimitGoerli");
  console.log(contractAddress.UnilimitGoerli);
  const logs = await provider.getLogs({
    fromBlock: 100000,
    //toBlock: "latest",
    address: contractAddress.UnilimitGoerli,
    /*
    topics: [
      "0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5", //"Open()"
    ],
    */
  });
  console.log("logs");
  console.log(logs);
  const decodedEvents = logs.map((log) => iface.parseLog(log));
  console.log("decodedEvents");
  console.log(decodedEvents);

  /*
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
  */
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
