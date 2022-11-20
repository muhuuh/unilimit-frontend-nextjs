import { useState } from "react";

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onCloseHandler = () => {
    setIsVisible(false);
  };

  const onVisibleHandler = () => {
    setIsVisible(true);
  };

  return {
    isVisible: isVisible,
    onCloseHandler: onCloseHandler,
    onVisibleHandler: onVisibleHandler,
  };
};

export default useModal;

