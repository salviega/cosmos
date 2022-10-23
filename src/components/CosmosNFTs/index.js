import "./CosmosNFTs.scss"
import React from 'react'

export function CosmosNFTs({ children, currency, setItem, setLoading, setSincronizedItems, setOpenModal }) {
  
  return (
    <div className='nfts'>
      
      <div className='nfts-container'>
        {React.Children.toArray(children).map(child => React.cloneElement(child, { currency, setItem, setLoading, setSincronizedItems, setOpenModal }))}
      </div>
    </div>
  )
}