import { ethers } from "ethers";
import React from "react";
import "./CosmosNFT.scss";
import logo from "./../../asserts/images/logo-cosmos.png";
import { useContracts } from "../CosmosContext";

export function CosmosNFT({
  key,
  item,
  currency,
  setItem,
  setLoading,
  setSincronizedItems,
  setOpenModal,
}) {
  const contracts = useContracts();
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

  const onShowDetail = (item) => {
    setItem(item);
    setOpenModal(true);
  };

  return (
    <div className="nft">
      <figure onClick={() => onShowDetail(item)}>
        <img src={item.image} alt="logo" />
      </figure>
      <div className="nft-description">
        <p className="nft-description__title">{item.name}</p>
        <div className="nft-description-container">
          <figure onClick={() => onShowDetail(item)}>
            <img alt="logo" src={logo} />
          </figure>
          <p className="nft-description-container__price">
            {parseInt(item.price) / 1000000000000000000}
          </p>
        </div>
      </div>
      <button className="nft-description__show" onClick={onBuy}>
        Comprar
      </button>
    </div>
  );
}
