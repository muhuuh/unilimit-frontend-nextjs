import React, { useState } from "react";
//import { useUniswapV3 } from "../../lib/uniswapV3";
import { useMoralis } from "react-moralis";
import { useUniswapV3 } from "../../../hooks/use-uniswap";

const OrderBoxSwapBot = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [swapError, setSwapError] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const uniswap = useUniswapV3();
  const { web3 } = useMoralis();

  const handleSwap = async () => {
    setSwapError(null);
    setSwapLoading(true);

    if (!uniswap) {
      setSwapError("Uniswap is not initialized");
      setSwapLoading(false);
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
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <div>
      <h1>Token Swap</h1>
      {swapError && <p className="error">{swapError}</p>}
      <form onSubmit={handleSwap}>
        <label htmlFor="fromToken">
          From Token:
          <input
            type="text"
            id="fromToken"
            value={fromToken}
            onChange={(event) => setFromToken(event.target.value)}
          />
        </label>
        <br />
        <label htmlFor="toToken">
          To Token:
          <input
            type="text"
            id="toToken"
            value={toToken}
            onChange={(event) => setToToken(event.target.value)}
          />
        </label>
        <br />
        <label htmlFor="amount">
          Amount:
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={swapLoading}>
          Swap
        </button>
      </form>
    </div>
  );
};

export default OrderBoxSwapBot;
