import './CosmosNFTDetails.scss'
import logo from './../../../assets/images/logo-cosmos.png'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContracts } from '../../../hooks/context'

export function CosmosNFTDetails ({
  item,
  onLoading,
  onSincronizedItems,
  setOpenModal
}) {
  const contracts = useContracts()

  const onBuy = async () => {
    try {
      setOpenModal(false)
      onLoading()
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.marketPlaceContract.address
      )

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.marketPlaceContract.buyItem(
            contracts.cosmoContract.address,
            item.itemId,
            { gasLimit: 250000 }
          )
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then((_response2) => {
              setTimeout(() => {
                onSincronizedItems()
                alert('Compra exitosa')
              }, 3000)
            })
            .catch((error) => {
              onSincronizedItems()
              alert('Hubo un error, revisa la consola')
              console.error(error)
            })
        })
        .catch((error) => {
          onSincronizedItems()
          alert('Hubo un error, revisa la consola')
          console.error(error)
        })
    } catch (error) {
      onSincronizedItems()
      alert('Hubo un error, revisa la consola')
      console.error(error)
    }
  }
  const closeModal = () => {
    setOpenModal(false)
  }

  return (
    <div className='collection-modal-container'>
      <div className='collection-modal-container__cancel' onClick={closeModal}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className='collection-modal-container-content'>
        <figure>
          <img src={item.image} alt='logo' />
        </figure>
        <div className='collection-modal-container-content-metadata'>
          <p className='collection-modal-container-content-metadata__title'>
            {item.name}
          </p>
          <p className='collection-modal-container-content-metadata__price'>
            Price
          </p>
          <div className='collection-modal-container-content-metadata-sale'>
            <img alt='logo' src={logo} width={20} height={20} />
            <p className='collection-modal-container-content-metadata-sale__icon'>
              {parseInt(item.price) / 1000000000000000000}
            </p>
          </div>
          <div className='collection-modal-container-content-metadata-container'>
            <p className='collection-modal-container-content-metadata-container__contract'>
              Direcci??n del artista{' '}
              <a href={`https://testnet.snowtrace.io/address/${item.artist}`}>
                {' '}
                {item.artist.slice(0, 6) + '...' + item.artist.slice(36)}
              </a>
            </p>
            <p className='collection-modal-container-content-metadata-container__item'>
              Token ID <p>{item.tokenId}</p>
            </p>
            <p className='collection-modal-container-content-metadata-container__item'>
              Token Standard <p>{item.tokenStandard}</p>
            </p>
            <div className='collection-modal-container-content-metadata-container__item'>
              Derechos de autor
              <p
                className='collection-modal-container-content-metadata-container__item'
                style={{ 'column-gap': '8px' }}
              >
                <img alt='logo' src={logo} />{' '}
                <p>{item.taxFee / 1000000000000000000}</p>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className='collection-modal-container__description'>
        {item.description}
      </p>
      <div className='collection-modal-container-buy' onClick={() => onBuy()}>
        <button>
          <FontAwesomeIcon
            icon={faWallet}
            className='collection-modal-container-metadata-buy__icon'
          />
          Comprar
        </button>
      </div>
    </div>
  )
}
