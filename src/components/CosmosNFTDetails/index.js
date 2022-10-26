import './CosmosNFTDetails.scss'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faXmark } from '@fortawesome/free-solid-svg-icons'
import logo from './../../asserts/images/logo-cosmos.png'
import { useContracts } from '../CosmosContext'

export function CosmosNFTDetails ({
  item,
  setLoading,
  setSincronizedItems,
  setOpenModal
}) {
  const contracts = useContracts()

  const onBuy = async () => {
    console.log(':d')
    try {
      setLoading(true);
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.marketPlaceContract.address
      );

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.marketPlaceContract.buyItem(
            contracts.cosmoContract.address,
            item.itemId,
            { /*value: item.price,*/ gasLimit: 250000 }
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then((_response2) => {
              alert("Compra exitosa");
              setSincronizedItems(false);
            })
            .catch((error) => {
              console.error(error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const closeModal = () => {
    setOpenModal(false)
  }

  return (
    <div className='collection-modal-container'>
      <div
        className='collection-modal-container__cancel'
        onClick={closeModal}
      >
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className='collection-modal-container-content'>
        <figure>
          <img src={item.image} alt='logo' />
        </figure>
        <div className='collection-modal-container-content-metadata'>
          <p className='collection-modal-container-content-metadata__title'>{item.name}</p>
          <p className='collection-modal-container-content-metadata__price'>Price</p>
          <div className='collection-modal-container-content-metadata-sale'>
            <img alt='logo' src={logo} width={20} height={20} />
            <p className='collection-modal-container-content-metadata-sale__icon'>
              {parseInt(item.price) / 1000000000000000000}
            </p>
          </div>
          <div className='collection-modal-container-content-metadata-container'>
            <p className='collection-modal-container-content-metadata-container__contract'>
              Contract Address{' '}
              <a href={`https://goerli.etherscan.io/address/${item.contract}`}>
                {' '}
                {item.contract.slice(0, 6) + '...' + item.contract.slice(36)}
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
            <p className='collection-modal-container-content-metadata-container__item' style={{'column-gap': '8px'}}>
               <img alt='logo' src={logo} /> <p>{item.taxFee / 1000000000000000000}</p>
            </p>
            </div>
          </div>
        </div>
      </div>
      <p className='collection-modal-container__description'>{item.description}</p>
      <div className='collection-modal-container-buy' onClick={() =>onBuy()}>
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
