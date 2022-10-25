import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../CosmosContext";
import "./CosmosMarketplace.scss";
import { CosmosNFTs } from "../CosmosNFTs";
import { CosmosNFT } from "../CosmosNFT";
import { CosmosModal } from "../CosmosModal";
import { CosmosNFTDetails } from "../CosmosNFTDetails";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { ethers } from "ethers";
import { CosmosSupplyNFTs } from "../CosmosSupplyNFTs";
import { CosmosNFTsResume } from "../CosmosNFTsResume";
import { CosmosPurchasedNFTDetails } from "../CosmosPurchasedNFTDetails";
import { getDataMarketPlaceSubGraph } from "../../middleware/getDataMarketPlaceSubGraph.js";

export function CosmosMarketplace() {
  const { getItemsForSale, getPurchasedItems } = getDataMarketPlaceSubGraph();
  const auth = useAuth();
  const contracts = useContracts();
  const [itemsForSale, setItemsForSale] = React.useState([]);
  const [purchasedItems, setPurchasedItems] = React.useState([]);
  const [currency, setCurrency] = React.useState(0);
  const [tokenIdCounter, setTokenIdCounter] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);
  const [item, setItem] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalSummary, setOpenModalSummary] = React.useState(false);

  const fetchData = async () => {
    try {
      const feedContract = contracts.feedContract;
      const marketPlaceContract = contracts.marketPlaceContract;

      const currency = await feedContract.getLatestPrice();
      const tokenIdCounter = await marketPlaceContract.tokenIdCounter();
      setTokenIdCounter(ethers.BigNumber.from(tokenIdCounter).toNumber());
      setCurrency(ethers.BigNumber.from(currency).toNumber());

      const filteredSaleForItems = await filterSaleForItems(
        await getItemsForSale(),
        await getPurchasedItems()
      );

      await refactorItems(filteredSaleForItems, setItemsForSale);
      await refactorItems(await getPurchasedItems(), setPurchasedItems);
      setSincronizedItems(true);
      console.log("Fetch sincronized");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const refactorItems = async (items, state) => {
    const result = items.map(async (item) => {
      const response = await fetch(item.tokenURI);
      const metadata = await response.json();
      const refactoredItem = {
        itemId: item.itemId,
        title: metadata.title,
        description: metadata.description,
        price: item.price,
        url: metadata.url,
        artist: item.artist,
        taxFee: item.taxFee,
        addressTaxFeeToken: item.addressTaxFeeToken,
        contract: item.nft,
        tokenId: item.tokenId,
        tokenStandard: metadata.tokenStandard,
        blockchain: metadata.Blockchain,
        buyer: item.buyer,
      };
      return refactoredItem;
    });
    const refactoredItems = await Promise.all(result);
    state(refactoredItems);
  };

  React.useEffect(() => {
    fetchData();
  }, [sincronizedItems]);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }
  return (
    <div className="marketplace">
      <p className="marketplace__title">Una vida llena de arte</p>
      <p className="marketplace__description">
        Curamos una colección de piezas de arte digital exclusivas para nuestros
        clientes Cosmos BBVA.
      </p>
      {error && "Hubo un error... mira la consola"}
      {!loading && !error && auth.user.isAdmin && (
        <div className="marketplace-admin">
          <CosmosSupplyNFTs
            tokenIdCounter={tokenIdCounter}
            setLoading={setLoading}
            setSincronizedItems={setSincronizedItems}
          />
        </div>
      )}
      {loading && !error && (
        <div className="marketplace__loading">
          <CosmosLoading />
        </div>
      )}
      {!loading && !error && (
        <div>
          <CosmosNFTs
            currency={currency}
            setItem={setItem}
            setLoading={setLoading}
            setSincronizedItems={setSincronizedItems}
            setOpenModal={setOpenModal}
          >
            {itemsForSale
              ? itemsForSale.map((item, index) => (
                  <CosmosNFT key={index} item={item} />
                ))
              : "There don't NFTs in sale"}
          </CosmosNFTs>
          <CosmosNFTsResume
            currency={currency}
            itemsForSale={itemsForSale}
            purchasedItems={purchasedItems}
            setItem={setItem}
            setOpenModalSummary={setOpenModalSummary}
          />
        </div>
      )}
      {openModal && (
        <CosmosModal>
          <CosmosNFTDetails
            item={item}
            currency={currency}
            setLoading={setLoading}
            setSincronizedItems={setSincronizedItems}
            setOpenModal={setOpenModal}
          />
        </CosmosModal>
      )}
      {openModalSummary && (
        <CosmosModal>
          <CosmosPurchasedNFTDetails
            item={item}
            currency={currency}
            setOpenModalSummary={setOpenModalSummary}
          />
        </CosmosModal>
      )}
    </div>
  );
}

async function filterSaleForItems(itemsForSale, purchasedItems) {
  const boughtItems = [];
  itemsForSale.forEach((itemForSale) => {
    purchasedItems.forEach((purchasedItem) => {
      if (itemForSale.itemId === purchasedItem.itemId) {
        boughtItems.push(itemForSale);
      }
    });
  });

  const filteredItems = await removeDuplicates([
    ...itemsForSale,
    ...boughtItems,
  ]);
  return filteredItems;
}

async function removeDuplicates(itemListWithDuplicates) {
  const itemListWithoutDuplicates = itemListWithDuplicates.filter(
    (item, index) => {
      itemListWithDuplicates.splice(index, 1);
      const unique = !itemListWithDuplicates.includes(item);
      itemListWithDuplicates.splice(index, 0, item);
      return unique;
    }
  );

  const saleForItems = await Promise.all(itemListWithoutDuplicates);
  return saleForItems;
}
