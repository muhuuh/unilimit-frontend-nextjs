import { ethers } from "ethers";
import abi from "../../constants/abi.json" assert { type: "json" };
import contractAddress from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingClosed() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );
  const currentBlock = await provider.getBlock("latest");
  console.log("currentBlock");

  const iface = new ethers.utils.Interface(abi);
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0xbf67515a38ee520223d32c1266d52101c30d936ed1f3e436c8caeb0a43cb06bf", // Close(uint256 positionId)
    ],
  });

  const decodedEvents = logs.map((log) => {
    const contract = log.address;
    const decodedEvent = iface.parseLog(log);
    return { contract: contract, decodedEventLogs: decodedEvent };
  });

  //const contractPool = decodedEvents.map((event) => event.contract);
  const positionId = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["positionId"].toString()
  );

  /*
  const scrapedClosedOrders = [];
  for (let i = 0; i < positionId.length; i++) {
    let newOrder = {
      pool: contractPool[i],
      positionId: positionId[i],
    };
    scrapedClosedOrders.push(newOrder);
  }
  */
  return positionId;
}

scrapingClosed().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
