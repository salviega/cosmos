import React from 'react'
import './CosmosPurchasedNFTDetails.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faXmark } from '@fortawesome/free-solid-svg-icons'
import logo from './../../asserts/images/logo-cosmos.png'
import { useContracts } from '../CosmosContext'


export function CosmosPurchasedNFTDetails ({
  item,
  currency,
  setLoading,
  setSincronizedItems,
  setOpenModalSummary
}) {
  const contracts = useContracts()

  const onBuy = async () => {
    try {
      const weiPrice = (parseInt(item.price) / currency) * 10 ** 18;

      setLoading(true);
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.marketPlaceContract.address
      );

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.marketPlaceContract.buytItem(
            contracts.cosmoContract.address,
            item.itemId,
            { value: weiPrice.toString(), gasLimit: 250000 }
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
    setOpenModalSummary(false)
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
          </div>
        </div>
      </div>
      <p className='collection-modal-container__description'>{item.description}</p>
      <div className='collection-modal-container-buy'>
        <button>
          <FontAwesomeIcon
            icon={faWallet}
            className='collection-modal-container-metadata-buy__icon'
            onClick={onBuy}
          />
          Buy now
        </button>
      </div>
    </div>
  )
}
