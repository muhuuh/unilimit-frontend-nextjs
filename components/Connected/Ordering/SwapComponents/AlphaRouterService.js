import { AlphaRouter } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import JSBI from "jsbi";
import ERC20ABI from "../../../../constants";
import { useSelector } from "react-redux";
import { useMoralis } from "react-moralis";

//TODO Create Swapstore and make everything flexible based on the selection

const AlphaRouterService = () => {
  const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  const INFURA_URL_TESTNET = process.env.NEXT_PUBLIC_INFURA_URL_TESTNET;
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isAuthenticated,
    authenticate,
    account,
  } = useMoralis();
  const chainId = parseInt(chainIdHex).toString();
  console.log("chainId router");
  console.log(chainId);

  const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);
  const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

  const swapStore = useSelector((state) => state.swap);

  const token0 = swapStore.token0;
  const token1 = swapStore.token1;

  const token0Token = new Token(
    chainId,
    token0.token_address,
    token0.decimals,
    token0.ticker
  );
  const token1Token = new Token(
    chainId,
    token1.token_address,
    token1.decimals,
    token1.ticker
  );

  //get amount of token that is in the wallet
  //TODO Need to export these functions
  const getContract0 = () =>
    new ethers.Contract(token0.token_address, ERC20ABI, web3Provider);
  const getContract1 = () =>
    new ethers.Contract(token1.token_address, ERC20ABI, web3Provider);

  const getPrice = async (
    inputAmount,
    slippageAmount,
    deadline,
    walletAddress
  ) => {
    const percentSlippage = new Percent(slippageAmount, 100);
    const wei = ethers.utils.parseUnits(
      inputAmount.toString(),
      token0.decimals
    );
    const currencyAmount = CurrencyAmount.fromRawAmount(
      token0Token,
      JSBI.BigInt(wei)
    );

    const route = await router.route(
      currencyAmount,
      token1Token,
      TradeType.EXACT_INPUT,
      {
        recipient: walletAddress,
        slippageTolerance: percentSlippage,
        deadline: deadline,
      }
    );

    const transaction = {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route.methodParameters.value),
      from: walletAddress,
      gasPrice: BigNumber.from(route.gasPriceWei),
      gasLimit: ethers.utils.hexlify(1000000),
    };

    const quoteAmountOut = route.quote.toFixed(6);
    const ratio = (inputAmount / quoteAmountOut).toFixed(3);

    return [transaction, quoteAmountOut, ratio];
  };

  const runSwap = async (transaction, signer) => {
    const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
    const contract0 = getContract0();
    await contract0
      .connect(signer)
      .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

    signer.sendTransaction(transaction);
  };

  return { getContract0, getContract1, getPrice, runSwap };
};

//export { getContract0, getContract1, getPrice, runSwap };
export default AlphaRouterService;
