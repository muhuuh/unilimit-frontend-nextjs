import React from "react";
//import { Modal } from "web3uikit";
import Modal from "../../UI/Modal";
import { tokens } from "../../../constants";
import TokenRow from "./TokenRow";

//TODO add image link to tokens.json and add the images here

const SelectToken0 = (props) => {
  //get all tokens tracked
  const tokensArray = Object.keys(tokens);
  const tokenList = tokensArray.map((token) => (
    <TokenRow
      ticker={token}
      onSelect={props.onSelect}
      onClose={props.onClose}
    />
  ));
  return (
    <Modal onClose={props.onClose}>
      <div className="px-14 py-10">
        <div className="mb-8 font-bold">Select Token </div>
        {tokenList}
      </div>
      <button
        onClick={props.onClose}
        className="bg-grayishBlue text-white border-2 rounded-lg px-4 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black mt-8"
      >
        Close
      </button>
    </Modal>
  );
};

export default SelectToken0;
