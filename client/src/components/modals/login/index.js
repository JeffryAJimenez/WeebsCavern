import React from "react";
import ReactDom from "react-dom";
import LoginPostModal from "./login";

const Modal = ({ isShowing, hide }) => {
  return isShowing
    ? ReactDom.createPortal(
        <LoginPostModal hide={hide} />,
        document.querySelector("#modal")
      )
    : null;
};

export default Modal;