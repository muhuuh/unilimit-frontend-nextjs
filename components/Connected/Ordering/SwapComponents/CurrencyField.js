import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import useInput from "../../../../hooks/use-input";
import TokensModal from "./SelectSwapToken/TokensModal";

const CurrencyField = (props) => {
  //const { isVisible, onCloseHandler, onVisibleHandler } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [formIsValid, setFormIsValid] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  let showValue;

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
    setCurrentAmount(props.balancePercentage);
  }, [props.balancePercentage]);
  useEffect(() => {
    setCurrentAmount(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (quantityInput.enteredInputisValid && quantityInput.enteredInput > 0) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
    console.log();
  }, [inputValue]);

  useEffect(() => {
    if (props.balancePercentage > 0) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [props.balancePercentage]);

  useEffect(() => {
    if (formIsValid) {
      getPrice(currentAmount);
      if (props.tokenNumber === 0) {
        checkDisable(formIsValid);
      }
    }
  }, [formIsValid, currentAmount]);

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

  if (currentAmount > 0 && props.tokenNumber === 0) {
    showValue = currentAmount.toFixed(5);
    //showValue = props.tokenNumber === 0 ? currentAmount : props.value;
  } else {
    showValue = props.value;
  }

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
                value={showValue}
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
