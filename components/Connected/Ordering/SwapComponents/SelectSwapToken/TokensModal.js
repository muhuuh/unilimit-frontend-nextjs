import React from "react";
import Modal from "../../../../UI/Modal";
import { tokens } from "../../../../../constants";
import TokenRow from "./TokenRow";

const TokensModal = (props) => {
  console.log("tokens modal");
  console.log(tokens);
  let tokenList = [];

  Object.keys(tokens).forEach((token) => {
    tokenList.push({
      ticker: token,
      token_address: tokens[token].token_address,
      name: tokens[token].name,
      decimals: tokens[token].decimals,
    });
  });
  console.log("tokenList");
  console.log(tokenList);

  const tokenRows = tokenList.map((token) => (
    <TokenRow
      ticker={token.ticker}
      name={token.name}
      token_address={token.token_address}
      decimals={token.decimals}
      tokenNumber={props.tokenNumber}
      onClose={props.onClose}
    />
  ));
  return (
    <Modal onClose={props.onClose}>
      <div className="flex flex-col items-center">
        <div className="font-bold text-lg">Select Token</div>
        <div className="flex flex-col w-1/2 mt-8 gap-y-4">{tokenRows}</div>

        <div className="flex justify-center mt-10">
          <button
            onClick={props.onClose}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TokensModal;
