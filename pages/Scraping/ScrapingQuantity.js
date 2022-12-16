import { ethers } from "ethers";
import abi from "../../constants/abi.json" assert { type: "json" };
import addressPairPool from "../../constants/addressPairPool.json" assert { type: "json" };
import contractAddresses from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingQuantity() {
  const currentPoolAddress = contractAddresses["USDC/WETH"].chain["5"][0];
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  const iface = new ethers.utils.Interface(abi);
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: currentPoolAddress,
    //TODO change topic to make sure it is the current trader
    topics: [
      "0x7d1114a92a206d9f21c8d18a4861689f9c82fad6213ca107aa3e11406a119bb8", // Size
      "0x00000000000000000000000078fe389778e5e8be04c4010ac407b2373b987b62",
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

  for (let i = 0; i < positionId.length; i++) {
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
