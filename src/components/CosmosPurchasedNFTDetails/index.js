import React from 'react'
import './CosmosPurchasedNFTDetails.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export function CosmosPurchasedNFTDetails ({
  item,
  currency,
  setOpenModalSummary
}) {
  const closeModal = () => {
    setOpenModalSummary(false)
  }

  return (
    <div className='collection-modal'>
      <div className='collection-modal__cancel' onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className='collection-modal__header'>
        <figure>
          <img src={item.url} alt='logo' />
        </figure>
        <div className='collection-modal-description'>
          <p className='collection-modal-description-container__title'>
            {item.title}
          </p>
          <p className='collection-modal-description-container__price'>Price</p>
          <div className='collection-modal-description-sale'>
            <FontAwesomeIcon
              icon={faEthereum}
              className='collection-modal-description-sale__attribute'
            />
            <p className='collection-card-description-sale__attribute'>
              {(parseInt(item.price) / currency).toFixed(3)}
            </p>
            <p className='collection-modal-description-sale__currency'>
              ${parseInt(item.price).toFixed(2)}
            </p>
          </div>
          <div className='collection-modal-description-container'>
            <p className='collection-modal-description-container__attribute'>
              Contract Address{' '}
              <a href={`https://goerli.etherscan.io/address/${item.contract}`}>
                {' '}
                {item.contract.slice(0, 6) + '...' + item.contract.slice(36)}
              </a>
            </p>
            <p className='collection-modal-description-container__attribute'>
              Token ID <p>{item.tokenId}</p>
            </p>
            <p className='collection-modal-description-container__attribute'>
              Token Standard <p>{item.tokenStandard}</p>
            </p>
            <p className='collection-modal-description-container__attribute'>
              Blockchain <p>{item.blockchain}</p>
            </p>
          </div>
        </div>
      </div>
      <p className='collection-modal-description__text'>{item.description}</p>
    </div>
  )
}
