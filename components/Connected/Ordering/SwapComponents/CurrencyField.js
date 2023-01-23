import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import useInput from "../../../../hooks/use-input";
import TokensModal from "./SelectSwapToken/TokensModal";

const CurrencyField = (props) => {
  //const { isVisible, onCloseHandler, onVisibleHandler } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [formIsValid, setFormIsValid] = useState(false);

  //---------------Form validity checks ---------------
  const checkValidity = (input) => {
    return input.trim() !== "";
  };
  const quantityInput = useInput(checkValidity);
  const quantityInputClasses = quantityInput.hasError
    ? "form-control invalid"
    : "form-control";

  const checkDisable = (disableStatus) => {
    props.disabledHandler(disableStatus);
  };

  //--------------Get swap Price -----------------
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };

  useEffect(() => {
    if (quantityInput.enteredInputisValid && quantityInput.enteredInput > 0) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    console.log();
  }, [inputValue]);

  useEffect(() => {
    if (formIsValid && quantityInput.enteredInput > 0) {
      getPrice(quantityInput.enteredInput);
      if (props.tokenNumber === 0) {
        checkDisable(formIsValid);
      }
    }
  }, [formIsValid]);

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
    quantityInput.inputChangeHandler(event);
  };
  const onCloseHandler = () => {
    setIsVisible(false);
    //if (props.tokenNumber == 0 && inputValue > 0) getPrice(inputValue);
  };

  const onBlurHandler = (event) => {
    quantityInput.inputBlurHandler();
    console.log("formIsValid blur");
    console.log(formIsValid);
    if (formIsValid && props.tokenNumber === 0) {
      getPrice(event.target.value);
    }
  };

  //-------------Spinn loader ----------------
  const fetchElement = (
    <div>
      <BeatLoader color="#36d7b7" size={8} margin={3} />
    </div>
  );

  return (
    <div>
      <div className="flex flex-row gap-x-3">
        <div className="">
          <div className={`${quantityInputClasses} `}>
            {props.loading ? (
              <div className="text-center py-5 ">{fetchElement}</div>
            ) : (
              <input
                className="bg-gray-100 h-14 rounded-lg py-2 px-3 text-gray-800"
                placeholder="0.0"
                value={props.value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
              />
            )}
          </div>
          <div className="text-sm text-left text-gray-400 -mt-6">
            Balance: {props.balance?.toFixed(3)}
          </div>
        </div>

        <div
          onClick={() => {
            setIsVisible(true);
          }}
          className="cursor-pointer pt-2"
        >
          <span className="text-lg font-medium text-gray-100">
            {props.ticker}
          </span>
        </div>
      </div>
      {isVisible && (
        <TokensModal onClose={onCloseHandler} tokenNumber={props.tokenNumber} />
      )}
    </div>
  );
};

export default CurrencyField;
