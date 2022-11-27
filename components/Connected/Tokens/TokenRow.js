import React from "react";

const TokenRow = (props) => {
  const onSelectHandler = () => {
    props.onSelect(props.ticker);
    props.onClose();
  };
  return (
    <div
      onClick={onSelectHandler}
      className="flex flex-row justify-around cursor-pointer border-b-2 rounded-lg "
    >
      <div>Image</div>
      <div className="text-center">
        <div className="text-lg">{props.ticker}</div>
      </div>
    </div>
  );
};

export default TokenRow;
