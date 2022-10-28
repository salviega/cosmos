import './CosmosNFTs.scss'
import React from 'react'

export function CosmosNFTs ({
  children,
  currency,
  onLoading,
  onSincronizedItems,
  setItem,
  setOpenModal
}) {
  return (
    <div className='nfts'>
      <div className='nfts-container'>
        {React.Children.toArray(children).map((child) =>
          React.cloneElement(child, {
            currency,
            onLoading,
            onSincronizedItems,
            setItem,
            setOpenModal
          })
        )}
      </div>
    </div>
  )
}
