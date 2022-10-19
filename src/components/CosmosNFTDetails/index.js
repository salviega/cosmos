import "./CosmosNFTDetails.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faWallet, faXmark } from "@fortawesome/free-solid-svg-icons";

export function CosmosNFTDetails({
  item,
  setOpenModal
}) {
  
  const closeModal = () => {
    setOpenModal(false);
  };
  
  return (
    <div className="collection-modal-container">
      <div className="collection-modal-container__cancel" 
        onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className="collection-modal-container-content">
        <figure>
          <img src={item.imgbase64} alt="logo" />
        </figure>
      </div>
    </div>
  );
}
