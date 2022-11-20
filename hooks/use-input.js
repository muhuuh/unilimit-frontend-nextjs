import { useReducer } from "react";

const useInput = (validityCheck) => {

  const defaultState = {
    value: "",
    isTouched: false,
  };

  const inputStateReducer = (state, action) => {
    if (action.type === "NAME") {
      return {
        value: action.nameInput,
        isTouched: state.isTouched,
      };
    }
    if (action.type === "BLUR") {
        return {
            value: state.value,
            isTouched: true,
        };
    }
    if (action.type === "RESET") {
        return {
            value: '',
            isTouched: false,
        };
    }

    return inputState
  };

  const [inputState, dispatchInput] = useReducer(inputStateReducer, defaultState);

  const inputChangeHandler = (event) => {
    dispatchInput({type: "NAME", nameInput: event.target.value})
  };

  const inputBlurHandler = () => {
    dispatchInput({type: "BLUR"})
  };

  const resetInput = () => {
    dispatchInput({type: "RESET"})
  };

  const enteredInputisValid = validityCheck(inputState.value);
  const hasError = !enteredInputisValid && inputState.isTouched;

  return {
    enteredInput: inputState.value,
    enteredInputisValid: enteredInputisValid,
    hasError: hasError,
    inputChangeHandler: inputChangeHandler,
    inputBlurHandler: inputBlurHandler,
    resetInput: resetInput,
  };
};

export default useInput;
