import React from 'react';
import events from '../../asserts/json/harcoredData.json'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import "./CosmosMarketplace.scss"
import { CosmosNFTs } from '../CosmosNFTs';
import { CosmosNFT } from '../CosmosNFT';
import { CosmosModal } from '../CosmosModal'
import { CosmosNFTDetails } from '../CosmosNFTDetails';

export function CosmosMarketplace() {
  const auth = useAuth();
  const [item, setItem] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);


  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }
  return(
    <div className='marketplace'>
        <p className='marketplace__title'>Explore, Create & Collect</p>
        <p className='marketplace__description'>the leading mulltichain NFT Marketplace, Home to the next generation of digital creators. Discover the best NFT collections.</p>
        <CosmosNFTs setItem={setItem} setOpenModal={setOpenModal}>
          {events?.map((nft, index) => (
              <CosmosNFT key={index} nft={nft} />
            ))}
        </CosmosNFTs>
        {openModal && (
        <CosmosModal>
          <CosmosNFTDetails item={item} setOpenModal={setOpenModal} />
        </CosmosModal>
      )}
    </div>
  )
}