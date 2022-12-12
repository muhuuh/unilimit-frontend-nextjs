import { ethers } from "ethers";
import abi from "../../constants/abi.json" assert { type: "json" };
import contractAddress from "../../constants/contractAddress.json" assert { type: "json" };
import addressPairPool from "../../constants/addressPairPool.json" assert { type: "json" };
import contractAddresses from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingQuantity() {
  const allPoolsFromChain = addressPairPool["5"];
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");

  const iface = new ethers.utils.Interface(abi);
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x7d1114a92a206d9f21c8d18a4861689f9c82fad6213ca107aa3e11406a119bb8", // Size
    ],
  });

  const decodedEvents = logs.map((log) => {
    const contract = log.address;
    const decodedEvent = iface.parseLog(log);
    return { contract: contract, decodedEventLogs: decodedEvent };
  });

  const contractPool = decodedEvents.map((event) => event.contract);
  const positionId = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["positionId"].toString()
  );
  const newQuantity = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["newQuantity"].toString()
  );

  const scrapedOrders = [];
  let currentQuantity, currentDecimals;
  for (let i = 0; i < positionId.length; i++) {
    const currentPoolAddress = contractPool[i];
    const currentPair = allPoolsFromChain[String(currentPoolAddress)];
    const pairDecimals = contractAddresses[String(currentPair)].decimals;
    //TODO find out which side it is to get the correct decimals
    /*
    if (side[i]) {
      currentDecimals = pairDecimals.token0;
    } else {
      currentDecimals = pairDecimals.token1;
    }
    currentQuantity = quantity[i] / 10 ** currentDecimals;
    */
    let newOrder = {
      pool: contractPool[i],
      positionId: positionId[i],
      newQuantity: newQuantity[i],
    };
    scrapedOrders.push(newOrder);
  }
  console.log("----------------------------------");
  console.log("scrapedOrdersQuantity");
  console.log(scrapedOrders);
  return scrapedOrders;
}

scrapingQuantity().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
