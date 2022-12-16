import { ethers } from "ethers";
//import abi from "./constants/abi.json" assert { type: "json" };
import abi from "../../constants/abi.json" assert { type: "json" };
import addressPairPool from "../../constants/addressPairPool.json" assert { type: "json" };
import contractAddresses from "../../constants/contractAddress.json" assert { type: "json" };

export async function scrapingCreated() {
  const allPoolsFromChain = addressPairPool["5"];
  const currentPoolAddress = contractAddresses["USDC/WETH"].chain["5"][0];
  console.log("currentPoolAddress");
  console.log(currentPoolAddress);

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  );

  console.log("run test");

  const currentBlock = await provider.getBlock("latest");
  console.log("currentBlock");
  console.log(currentBlock);
  console.log("----------------------------------");

  const iface = new ethers.utils.Interface(abi);
  console.log("Getting Logs ...");
  const logs = await provider.getLogs({
    fromBlock: 8049200,
    //TODO Put correct contract address
    address: currentPoolAddress,
    //TODO add indexed topics to five trader calling it
    topics: [
      "0x6c40f5ef74fd79b0dad7fa3da61f0a6a8ef8bf63b75eae10782c62baa2baf1bb", //Open(uint256,address,bool,uint160,uint256)
      "0x00000000000000000000000078fe389778e5e8be04c4010ac407b2373b987b62",
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
  console.log(decodedEvents[0]);
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

  console.log("addressPairPool test");

  console.log("contractPool");
  console.log(contractPool);

  const scrappedPoolAddress = contractPool[0];
  const currentPair = allPoolsFromChain[String(scrappedPoolAddress)];
  console.log(allPoolsFromChain[String(scrappedPoolAddress)]);
  console.log(contractAddresses);
  console.log(contractAddresses[String(currentPair)].decimals);
  const currentPairDecimals = contractAddresses[String(currentPair)].decimals;
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
  let price, currentQuantity, currentDecimalsQuantity;
  for (let i = 0; i < positionId.length; i++) {
    const currentPoolAddress = contractPool[i];
    const currentPair = allPoolsFromChain[String(currentPoolAddress)];
    const pairDecimals = contractAddresses[String(currentPair)].decimals;
    if (side[i]) {
      currentDecimalsQuantity = pairDecimals.token1;
    } else {
      currentDecimalsQuantity = pairDecimals.token0;
    }
    console.log("currentDecimals");
    console.log(currentDecimalsQuantity);
    console.log(quantity[i]);
    console.log(10 ^ currentDecimalsQuantity);
    console.log(10 ** currentDecimalsQuantity);
    currentQuantity = quantity[i] / 10 ** currentDecimalsQuantity;

    console.log("sqrtPriceX96[i]");
    console.log(sqrtPriceX96[i]);
    //price = (parseInt(sqrtPriceX96[i]) ** 2 / 2 ** 192).toFixed(4); //prce token0
    price = (2 ** 192 / parseInt(sqrtPriceX96[i]) ** 2).toFixed(2); //price token1 or WETH
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
      quantity: currentQuantity,
      signature: signature[i],
    };
    scrapedOrders.push(newOrder);
  }
  console.log("----------------------------------");
  console.log("scrapedOrders");
  console.log(scrapedOrders);
  return scrapedOrders;
}
