import React from "react";

const OpenOrderIdRow = (props) => {
  return (
    <div className="flex flex-row justify-between items-center w-2/3 border-b-2">
      <div>{props.id}</div>
      <div>{props.status}</div>
      <div>{props.pair}</div>
      <div>{props.side}</div>
      <div>{props.quantity}</div>
      <div>{props.priceTarget}</div>
      <div>{props.priceCurrent}</div>
      <div className="my-2">
        <button className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black">
          Change
        </button>
      </div>
      <div className="my-2">
        <button className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black">
          Close
        </button>
      </div>
    </div>
  );
};

export default OpenOrderIdRow;
