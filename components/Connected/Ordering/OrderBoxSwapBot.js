import React, { useState } from "react";
//import { useUniswapV3 } from "../../lib/uniswapV3";
import { Form, Input, Button, useMoralis } from "react-moralis";
import { useUniswapV3 } from "../../../hooks/use-uniswap";

const TokenSwap = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [swapError, setSwapError] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const uniswap = useUniswapV3();
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
    web3,
  } = useMoralis();

  const handleSwap = async () => {
    setSwapError(null);
    setSwapLoading(true);

    try {
      const fromTokenAddress = web3.utils.toChecksumAddress(fromToken);
      const toTokenAddress = web3.utils.toChecksumAddress(toToken);
      const amountInWei = web3.utils.toWei(amount.toString());
      const txHash = await uniswap.swap(
        fromTokenAddress,
        toTokenAddress,
        amountInWei
      );

      console.log(`Token swap transaction hash: ${txHash}`);
    } catch (error) {
      setSwapError(error.message);
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <Form>
      <h1>Token Swap</h1>
      <Input
        label="From Token"
        type="text"
        value={fromToken}
        onChange={(event) => setFromToken(event.target.value)}
      />
      <Input
        label="To Token"
        type="text"
        value={toToken}
        onChange={(event) => setToToken(event.target.value)}
      />
      <Input
        label="Amount"
        type="number"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <Button onClick={handleSwap} disabled={swapLoading}>
        Swap
      </Button>
      {swapError && <p style={{ color: "red" }}>{swapError}</p>}
    </Form>
  );
};

export default TokenSwap;
