import Backdrop from "./Backdrop";
import ModelOverlay from "./ModalOverlay";
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";

const Modal = (props) => {
  const portalElement = document.getElementById("modal-root");
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    props.onClose();
  };

  //const modalContent = show ? <div>{props.children}</div> : null;

  if (isBrowser) {
    return (
      <div>
        {ReactDOM.createPortal(
          <Backdrop onClose={props.onClose} />,
          portalElement
        )}
        {ReactDOM.createPortal(
          <ModelOverlay>{props.children}</ModelOverlay>,
          portalElement
        )}
      </div>
    );
  } else {
    return null;
  }

  //continue here if needed: https://www.youtube.com/watch?v=iolkZAg00gk
};

export default Modal;
