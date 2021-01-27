import React from "react";
import ReactDom from "react-dom";
import SignUpPostModal from "./signup";

const Modal = ({ isShowing, hide }) => {
  return isShowing
    ? ReactDom.createPortal(
        <SignUpPostModal hide={hide} />,
        document.querySelector("#modal")
      )
    : null;
};

export default Modal;