import React from "react";
import ReactDom from "react-dom";
import CreatePostModal from "./create-post";

const Modal = ({ isShowing, hide }) => {
  return isShowing
    ? ReactDom.createPortal(
        <CreatePostModal hide={hide} />,
        document.querySelector("#modal")
      )
    : null;
};

export default Modal;
