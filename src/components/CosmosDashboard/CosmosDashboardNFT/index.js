import "./CosmosDashboardNFT.scss";
import logo from "./../../../assets/images/logo-cosmos.png";
import React, { useEffect } from "react";

export function CosmosDashboardNFT({
  key,
  item,
  contracts,
  setLoading,
  setSincronized,
  setItem,
  setOpenModal,
}) {
  const [parsedItem, setParsedItem] = React.useState(item);

  const onShowDetail = (item) => {
    setItem(item);
    setOpenModal(true);
  };

  useEffect(() => {
    setParsedItem(JSON.parse(item.metadata));
  });

  return (
    <div className="nft">
      <figure onClick={() => onShowDetail(parsedItem)}>
        <img src={parsedItem.image} alt="logo" />
      </figure>
      <div className="nft-description">
        <p className="nft-description__title">{parsedItem.name}</p>
        <div className="nft-description-container">
          <figure onClick={() => onShowDetail(parsedItem)}>
            <img alt="logo" src={logo} />
          </figure>
          <p className="nft-description-container__price">
            {parseInt(parsedItem.price) / 1000000000000000000}
          </p>
        </div>
      </div>
      <button className="nft-description__show">Comprar</button>
    </div>
  );
}
