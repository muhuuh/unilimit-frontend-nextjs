import React from "react";

const TokenRow = (props) => {
  const onSelectHandler = () => {
    props.onSelect(props.ticker);
    props.onClose();
  };
  return (
    <div
      onClick={onSelectHandler}
      className="flex flex-row justify-around cursor-pointer border-b-2 rounded-lg w-56 items-center py-2"
    >
      <div className="text-lg">{props.ticker}</div>
    </div>
  );
};

export default TokenRow;
