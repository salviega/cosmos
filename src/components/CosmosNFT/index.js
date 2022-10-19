import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './CosmosNFT.scss';

export function CosmosNFT({nft, setItem, setOpenModal}) {

  const onShowDetail = (item) => {
    setItem(nft);
    setOpenModal(true);
  };

  return (
    <div className="nft">
      <figure onClick={() => onShowDetail(nft)}>
        <img src={nft.imgbase64} alt="logo" />
      </figure>
      <div className="nft-description">
        <p className="nft-description__title">{nft.name}</p>
      </div>
  </div>
  )
}