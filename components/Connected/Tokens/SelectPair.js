import React from "react";
import { contractAddresses } from "../../../constants";
import Modal from "../../UI/Modal";
import TokenRow from "./TokenRow";

const SelectPair = (props) => {
  const pairArray = Object.keys(contractAddresses);
  console.log("pairArray");
  console.log(pairArray);
  const pairList = pairArray.map((pair) => (
    <TokenRow ticker={pair} onSelect={props.onSelect} onClose={props.onClose} />
  ));
  return (
    <Modal onClose={props.onClose}>
      <div className="px-14 py-10">
        <div className="mb-8 font-bold">Select Trading Pair </div>
        {pairList}
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

export default SelectPair;
