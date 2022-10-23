import './CosmosNFTDetails.scss'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faWallet, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ethers } from 'ethers'
import addresses from '../../blockchain/environment/contract-address.json'
import marketPlaceContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketPlaceContract.json'
const marketPlaceContractAddress = addresses[2].marketplacecontract

export function CosmosNFTDetails ({
  item,
  currency,
  setLoading,
  setSincronizedItems,
  setOpenModal
}) {
  const buyItem = async () => {
    try {
      const weiPrice = (parseInt(item.price) / currency) * 10 ** 18
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const web3Signer = web3Provider.getSigner()

      const marketPlaceContract = new ethers.Contract(
        marketPlaceContractAddress,
        marketPlaceContractAbi.abi,
        web3Signer
      )

      const response = await marketPlaceContract.buyItem(item.itemId, {
        value: weiPrice.toString(),
        gasLimit: 250000
      })
      setOpenModal(false)
      setLoading(true)

      web3Provider.waitForTransaction(response.hash).then((_response) => {
        setSincronizedItems(false)
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
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
          <img src={item.url} alt='logo' />
        </figure>
        <div className='collection-modal-container-content-metadata'>
          <p className='collection-modal-container-content-metadata__title'>{item.title}</p>
          <p className='collection-modal-container-content-metadata__price'>Price</p>
          <div className='collection-modal-container-content-metadata-sale'>
            <FontAwesomeIcon
              icon={faEthereum}
              className='collection-modal-container-content-metadata-sale__icon'
            />
            <p className='collection-modal-container-content-metadata-sale__icon'>
              {(parseInt(item.price) / currency).toFixed(3)}
            </p>
            <p className='collection-modal-container-content-metadata-sale__currency'>
              ${parseInt(item.price).toFixed(2)}
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
            <p className='collection-modal-container-content-metadata-container__item'>
              Blockchain <p>{item.blockchain}</p>
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
            onClick={buyItem}
          />
          Buy now
        </button>
      </div>
    </div>
  )
}
