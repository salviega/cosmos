import "./CosmosTransfer.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export function CosmosTransfer({ setOpenModalTransfer }) {
  const closeModal = () => {
    setOpenModalTransfer(false);
  };

  return (
    <div className="collection-modal-container">
      <div className="collection-modal-container__cancel" onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </div>

      <div className="collection-modal-container-buy">
        <button>
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className="collection-modal-container-metadata-buy__icon"
          />
          Transferir
        </button>
      </div>
    </div>
  );
}
