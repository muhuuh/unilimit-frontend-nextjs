import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import TokensModal from "./SelectSwapToken/TokensModal";

const CurrencyField = (props) => {
  //const { isVisible, onCloseHandler, onVisibleHandler } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  console.log;
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };

  const fetchElement = (
    <div>
      <BeatLoader color="#36d7b7" size={8} margin={3} />
    </div>
  );
  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
    if (event.target.value > 0) {
      getPrice(event.target.value);
    }
  };
  const onCloseHandler = () => {
    setIsVisible(false);
    //if (props.tokenNumber == 0 && inputValue > 0) getPrice(inputValue);
  };

  return (
    <div>
      <div className="flex flex-row gap-x-3 ">
        <div className="">
          {props.loading ? (
            <div className="text-center py-5">{fetchElement}</div>
          ) : (
            <input
              className="bg-gray-100 h-14 rounded-lg py-2 px-3 text-gray-800"
              placeholder="0.0"
              value={props.value}
              onChange={onChangeHandler}
              onBlur={(e) =>
                props.field === "input" ? getPrice(e.target.value) : null
              }
            />
          )}
        </div>

        <div
          onClick={() => {
            setIsVisible(true);
          }}
          className="cursor-pointer"
        >
          <span className="text-lg font-medium">{props.ticker}</span>
          <div className="text-sm text-gray-600">
            Balance: {props.balance?.toFixed(3)}
          </div>
        </div>
      </div>
      {isVisible && (
        <TokensModal onClose={onCloseHandler} tokenNumber={props.tokenNumber} />
      )}
    </div>
  );
};

export default CurrencyField;
