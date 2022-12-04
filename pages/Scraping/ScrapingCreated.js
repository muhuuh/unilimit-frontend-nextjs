import { ethers } from "ethers";
//import abi from "./constants/abi.json" assert { type: "json" };
import abi from "../../constants/abi.json" assert { type: "json" };
//import contractAddress from "./constants/contractAddress.json" assert { type: "json" };
import contractAddress from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingCreated() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  console.log("process.env.NEXT_PUBLIC_ALCHEMY_API_KEY");
  console.log(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);

  const currentBlock = await provider.getBlock("latest");
  console.log("currentBlock");
  console.log(currentBlock);
  console.log("----------------------------------");

  const iface = new ethers.utils.Interface(abi);
  console.log("Getting Logs ...");
  const logs = await provider.getLogs({
    fromBlock: 8049200,
    address: contractAddress.UnilimitGoerli,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x6c40f5ef74fd79b0dad7fa3da61f0a6a8ef8bf63b75eae10782c62baa2baf1bb", //Open(uint256,address,bool,uint160,uint256)
    ],
  });
  console.log("logs");
  console.log(logs);
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
  const trader = decodedEvents.map(
    (event) => event.decodedEventLogs["args"]["trader"]
  );
  const side = decodedEvents.map(
    (event) => event.decodedEventLogs["args"]["side"]
  );
  const sqrtPriceX96 = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["sqrtPriceX96"].toString()
  );
  const quantity = decodedEvents.map((event) =>
    event.decodedEventLogs["args"]["quantity"].toString()
  );
  const signature = decodedEvents.map((event) =>
    event.decodedEventLogs["signature"].toString()
  );

  console.log("contractPool");
  console.log(contractPool);
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

  //TODO divide the quantity received by the decimals of (if side true, token0, if false, token1)
  const scrapedOrders = [];
  let price;
  for (let i = 0; i < positionId.length; i++) {
    price = (parseInt(sqrtPriceX96[i]) ** 2 / 2 ** 192).toFixed(4);
    let newSide;
    if (side[i]) {
      newSide = "true";
    } else if (side[i] === false) {
      newSide = "false";
    } else {
      newSide = "undefined";
    }
    let newOrder = {
      pool: contractPool[i],
      positionId: positionId[i],
      trader: trader[i],
      side: newSide,
      sqrtPriceX96: price,
      quantity: quantity[i],
      signature: signature[i],
    };
    scrapedOrders.push(newOrder);
  }
  console.log("----------------------------------");
  console.log("scrapedOrders");
  console.log(scrapedOrders);
  return scrapedOrders;
}
