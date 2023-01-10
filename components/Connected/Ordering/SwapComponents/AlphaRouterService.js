import { AlphaRouter } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import JSBI from "jsbi";
import ERC20ABI from "../../../../constants";

//TODO Create Swapstore and make everything flexible based on the selection

const AlphaRouterService = () => {
  const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  const INFURA_URL_TESTNET = process.env.NEXT_PUBLIC_INFURA_URL_TESTNET;
  const chainId = 5;

  const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);
  const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });
};

export default AlphaRouterService;
