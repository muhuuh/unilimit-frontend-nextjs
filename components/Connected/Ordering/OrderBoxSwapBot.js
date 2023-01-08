import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useWeb3 } from "react-moralis";
import { useUniswapV3 } from "../../../hooks/use-uniswap";

const OrderBoxSwapBot = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [swapError, setSwapError] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const { web3, account } = useMoralis();
  //const { web3 } = useWeb3();
  const uniswap = useUniswapV3();

  const handleSwap = async (event) => {
    event.preventDefault();
    setSwapError(null);
    setSwapLoading(true);
    console.log("button clicked");
    console.log(uniswap);

    if (!uniswap) {
      setSwapError("Uniswap is not initialized");
      setSwapLoading(false);
      console.log("error");
      return;
    }

    try {
      const fromTokenAddress = web3.utils.toChecksumAddress(fromToken);
      const toTokenAddress = web3.utils.toChecksumAddress(toToken);
      const amountInWei = web3.utils.toWei(amount.toString());
      const options = {
        from: web3.eth.defaultAccount,
        gasPrice: web3.utils.toWei("5", "gwei"),
      };
      const txHash = await uniswap.Trade.swapExactTokensForTokens(
        amountInWei,
        options,
        fromTokenAddress,
        toTokenAddress
      );

      console.log(`Token swap transaction hash: ${txHash}`);
    } catch (error) {
      setSwapError(error.message);
      console.log("error swap");
      console.log(error);
    } finally {
      setSwapLoading(false);
      console.log("done");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={handleSwap}
        className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10 w-96"
      >
        <div className="mb-4">
          <label
            className="block font-bold mb-2 text-sm uppercase"
            htmlFor="fromToken"
          >
            From Token
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="fromToken"
            value={fromToken}
            onChange={(event) => setFromToken(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2 text-sm uppercase"
            htmlFor="toToken"
          >
            To Token
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="toToken"
            value={toToken}
            onChange={(event) => setToToken(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2 text-sm uppercase"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={swapLoading}
          >
            Swap
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderBoxSwapBot;
