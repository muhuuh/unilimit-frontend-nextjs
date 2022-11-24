import React from "react";
import useInput from "../../../hooks/use-input";

const ChangeAmountPopup = () => {
  //some entries might stay empty (just getting the current values if emtpy hence now validity check)
  const checkValidity = () => {
    return true;
  };

  const newAmountInput = useInput(checkValidity);
  const newPriceInput = useInput(checkValidity);

  const onSubmitHandler = () => {
    //TODO submit the new entries to store to udate the view and call the SC function
    //TODO put the input value as the current values

    let newAmount;
    if (newAmountInput.enteredInput) {
      newAmount = newAmountInput.enteredInput;
    } else {
      ("previous store value");
    }
    let newPrice;
    if (newPriceInput.enteredInput) {
      newAmount = newPriceInput.enteredInput;
    } else {
      ("previous store value");
    }
    const modifiedOrder = {
      amount: newAmount,
      price: newPrice,
    };
  };

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="mt-10 mx-24 border-2 rounded-xl shadow-md px-14 py-10"
      >
        <div className="text-center font-bold text-lg mb-14">
          Modify Open Order
        </div>
        <div className="flex flex-col">
          <div className={`flex flex-row justify-between gap-x-12 `}>
            <label>New order quantity</label>
            <input
              type="number"
              onChange={newAmountInput.inputChangeHandler}
              onBlur={newAmountInput.inputBlurHandler}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
          <div className={` flex flex-row justify-between  gap-x-12`}>
            <label>New target price </label>
            <input
              type="number"
              onChange={newPriceInput.inputChangeHandler}
              onBlur={newPriceInput.inputBlurHandler}
              className="border-2 rounded-lg shadow-sm h-8 w-48"
            />
          </div>
        </div>
        <div className="flex justify-around mt-8">
          <div>
            <button
              onClick={() => {
                setSetSell(false);
                dispatch(limitActions.updateSide(false));
              }}
              className={` text-white bg-buyGreen shadow hover:font-bold hover:scale-110 border-2 rounded-l-lg border-white w-20 py-1 px-2 `}
            >
              Buy
            </button>
            <button
              onClick={() => {
                setSetSell(true);
                dispatch(limitActions.updateSide(true));
              }}
              className={` text-white bg-darkRed shadow hover:font-bold hover:scale-110 border-2 rounded-r-lg border-white w-20 py-1 px-2 `}
            >
              Sell
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangeAmountPopup;
