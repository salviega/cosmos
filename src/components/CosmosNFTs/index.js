import "./CosmosNFTs.scss"
import React from 'react'

export function CosmosNFTs({ children, currency, setItem, setLoading, setSincronizedItems, setOpenModal }) {
  
  return (
    <div className='nfts'>
      <p className='nfts__title'>Markplace</p>
      <div className='nfts-container'>
        {React.Children.toArray(children).map(child => React.cloneElement(child, { setItem, setOpenModal }))}
      </div>
    </div>
  )
}