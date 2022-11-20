import React from "react";

const OpenOrderIdRow = (props) => {
  return (
    <div className="flex flex-row justify-between w-2/3">
      <div>{props.id}</div>
      <div>{props.status}</div>
      <div>{props.pair}</div>
      <div>{props.side}</div>
      <div>{props.quantity}</div>
      <div>{props.priceTarget}</div>
      <div>{props.priceCurrent}</div>
    </div>
  );
};

export default OpenOrderIdRow;
