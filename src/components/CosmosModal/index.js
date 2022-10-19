import "./CosmosModal.scss";
import React from "react";
import ReactDOM from 'react-dom'

export function CosmosModal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    document.getElementById("modal")
  );
}
