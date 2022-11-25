import React from "react";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/use-input";
import { openOrdersActions } from "../../store/openOrders-slice";
import Modal from "../../UI/Modal";

const ChangeAmountPopup = (props) => {
  const dispatch = useDispatch();
  //some entries might stay empty (just getting the current values if emtpy hence now validity check)
  const checkValidity = (input) => {
    return input.trim() !== "";
  };

  const newAmountInput = useInput(checkValidity);

  const newAmountInputClasses = newAmountInput.hasError
    ? "form-control invalid"
    : "form-control";

  let formIsValid = false;
  if (newAmountInput.enteredInputisValid && newAmountInput.enteredInput > 0) {
    formIsValid = true;
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("submit");

    //TODO put the input value as the current values
    if (!formIsValid) {
      return;
    }

    const newOrderQuantity = {
      id: props.id,
      quantity: newAmountInput.enteredInput,
    };
    //TODO call SC function to change order quantity with newOrderQuantity
    //TODO add if successful check, then update store with below function
    dispatch(openOrdersActions.updateQuantity(newOrderQuantity));

    props.onClose();
  };

  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSubmitHandler} className="">
        <div className="flex justify-center items-center text-center">
          <div className={` ${newAmountInputClasses}`}>
            <label className="text-lg mt-8">Modify order quantity</label>
            <input
              type="number"
              onChange={newAmountInput.inputChangeHandler}
              onBlur={newAmountInput.inputBlurHandler}
              className="border-2 rounded-lg shadow-sm mt-8 h-8 w-48"
            />
          </div>
        </div>
        <div className="flex justify-around mt-8">
          <div>
            <button
              type="submit"
              className={`text-white ${
                !formIsValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-buyGreen shadow hover:font-bold hover:scale-110"
              } border-2 rounded-lg border-white w-20 py-1 px-2 `}
              disabled={!formIsValid}
            >
              Change
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeAmountPopup;
