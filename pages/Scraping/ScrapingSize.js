import { ethers } from "ethers";
import abi from "../../constants/abi.json" assert { type: "json" };
import contractAddress from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingClosed() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  const iface = new ethers.utils.Interface(abi);
  const logs = await provider.getLogs({
    fromBlock: 8049000,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x7d1114a92a206d9f21c8d18a4861689f9c82fad6213ca107aa3e11406a119bb8", // SizeChanged(uint256,uint256)
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
  const newQuantity = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["newQuantity"].toString()
  );

  return positionId;
}

scrapingClosed().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
