import { ethers } from 'ethers';
import React from 'react';
import './CosmosNFT.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketPlaceContract.json";
import cosmoContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;

export function CosmosNFT({ key, item, currency, setItem, setLoading, setSincronizedItems, setOpenModal }) {

  const onBuy = async () => {
    try {
      const weiPrice = (parseInt(item.price) / currency * 10 ** 18)
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();

      
      const cosmoContractContract = new ethers.Contract(
        cosmoContractAddress,
        cosmoContractAbi.abi,
        web3Signer
      );

      await cosmoContractContract.authorizeOperator(marketPlaceContractAddress)

      const marketPlaceContract = new ethers.Contract(
        marketPlaceContractAddress,
        marketPlaceContractAbi.abi,
        web3Signer
      );

      const response = await marketPlaceContract.buyItem(
        cosmoContractAddress,
        item.itemId, { value: weiPrice.toString(), gasLimit: 250000 }
      )
      
      setLoading(true)
        
      web3Provider.waitForTransaction(response.hash)
      .then(_response => {
        setSincronizedItems(false)
        })

    } catch(error) {
      setLoading(false)
      console.log(error)
    }
  };
  
  const onShowDetail = (item) => {
    setItem(item);
    setOpenModal(true);
  };

  return (
    <div className="collection-card">
      <figure onClick={() => onShowDetail(item)}>
        <img src={item.url} alt="logo" />
      </figure>
      <div className="collection-card-description">
        <p className="collection-card-description__title">{item.title}</p>
        <div className="collection-card-description-container">
          <div className="collection-card-description-container-value">
            <FontAwesomeIcon
              icon={faEthereum}
              className="collection-card-description-container-value__icon"
            />
            <p className="collection-card-description-container-value__price">
              ${(parseInt(item.price) / currency).toFixed(3)}
            </p>
          </div>
          <p className="collection-card-description-container__currency">
            ${item.price} usd
          </p>
        </div>
      </div>
        <div className="collection-card-description__buy">
          <button onClick={onBuy}>Buy now</button>
        </div>
    </div>
  )
}