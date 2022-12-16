import { ethers } from "ethers";
import abi from "../../constants/abi.json" assert { type: "json" };
import contractAddresses from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingSettled() {
  const currentPoolAddress = contractAddresses["USDC/WETH"].chain["5"][0];
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  const iface = new ethers.utils.Interface(abi);
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: currentPoolAddress,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x7e953f96ae54ab2378a31227b9077cac6e9fa627cb10e333065cb7883c1df776", // Settle
      "0x00000000000000000000000078fe389778e5e8be04c4010ac407b2373b987b62",
    ],
  });

  const decodedEvents = logs.map((log) => {
    const contract = log.address;
    const decodedEvent = iface.parseLog(log);
    return { contract: contract, decodedEventLogs: decodedEvent };
  });

  console.log("decodedEvents settled");
  console.log(decodedEvents);
  const contractPool = decodedEvents.map((event) => event.contract);
  const positionId = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["positionId"].toString()
  );
  const settledQuantity = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["quantity"].toString()
  );
  const executionPrice = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["executionPrice"].toString()
  );
  const side = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["side"].toString()
  );

  const scrapedOrders = [];

  for (let i = 0; i < positionId.length; i++) {
    let settledOrder = {
      pool: contractPool[i],
      positionId: positionId[i],
      settledQuantity: settledQuantity[i],
      executionPrice: executionPrice[i],
      side: side[i],
    };
    scrapedOrders.push(settledOrder);
  }
  console.log("----------------------------------");
  console.log("executionPrice");
  console.log(executionPrice);
  return scrapedOrders;
}

scrapingSettled().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
