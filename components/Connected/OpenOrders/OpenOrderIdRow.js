import React from "react";

const OpenOrderIdRow = (props) => {
  return (
    <div className="flex flex-row justify-between w-2/3 border-b-2">
      <div>{props.id}</div>
      <div>{props.status}</div>
      <div>{props.pair}</div>
      <div>{props.side}</div>
      <div>{props.quantity}</div>
      <div>{props.priceTarget}</div>
      <div>{props.priceCurrent}</div>
      <button className="bg-grayishBlue text-white border-2 rounded-lg px-4 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black mt-8">
        Change
      </button>
      <button className="bg-grayishBlue text-white border-2 rounded-lg px-4 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black mt-8">
        Close
      </button>
    </div>
  );
};

export default OpenOrderIdRow;
