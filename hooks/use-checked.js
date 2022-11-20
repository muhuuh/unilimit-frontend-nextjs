import { useState } from "react";

const useChecked = () => {
  const [isChecked, setIsChecked] = useState(false);
  const onChangeHandler = () => {
    setIsChecked(!isChecked);
  };

  return {
    isChecked: isChecked,
    onChangeHandler: onChangeHandler,
  }
};


export default useChecked;