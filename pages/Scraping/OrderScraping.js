import React from "react";

export default async function eventFilter(
  contractAddress,
  erc20abi,
  _provider
) {
  //TODO install ethers

  console.log("orderscraping");
  const iface = new ethers.utils.Interface(erc20abi.abi);
  //TODO look if we can make it more precise here (filter also by indexed user wallet)
  const logs = await _provider.getLogs({
    address: contractAddress,
  });
  const decodedEvents = logs.map((log) => {
    iface.decodeEventLog("OpenOrder", log.data);
  });
  const fromAddresses = decodedEvents.map((event) => event["values"]["from"]);
  const orderId = decodedEvents.map((event) => event["values"]["order_id"]);
  const amount = decodedEvents.map((event) => event["values"]["value"]);
  const side = decodedEvents.map((event) => event["values"]["side"]);
  const status = decodedEvents.map((event) => event["values"]["status"]);

  const resultScraping = [fromAddresses, orderId, amount, side, status];
  //TODO add to store
  //TODO add logic to check if order is twice in the array, and if yes, only taking the latest (status closed, decreased/increase quantity)
  console.log(resultScraping);
  return resultScraping;
}

/*
eventFilter().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
*/
