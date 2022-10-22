import React from 'react';
import events from '../../asserts/json/harcoredData.json'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import "./CosmosMarketplace.scss"
import { CosmosNFTs } from '../CosmosNFTs';
import { CosmosNFT } from '../CosmosNFT';
import { CosmosModal } from '../CosmosModal'
import { CosmosNFTDetails } from '../CosmosNFTDetails';
import { ethers } from 'hardhat';
import feedContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol";
import {addresses} from "../../blockchain/environment/contract-address.json";
import { getDataMarketSubGraph } from "../../middleware/getDataColombianSubGraph";
const {feedContractAddress} = addresses[0];
const marketPlaceContractAddress = addresses[2].marketplacecontract;


export function CosmosMarketplace() {
  const { getItemsForSale, getPurchasedItems } = getDataMarketSubGraph();
  const auth = useAuth();
  const [itemsForSale, setItemsForSale] = React.useState([]);
  const [purchasedItems, setPurchasedItems] = React.useState([]);
  const [currency, setCurrency] = React.useState(0);
  const [tokenIdCounter, setTokenIdCounter] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);
  const [item, setItem] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);

  const fetchData = async() => {
    try {
        let provider = new ethers.providers.JsonRpcProvider(
        "https://api.avax-test.network/ext/bc/C/rpc"
      );

      const feedContract = new ethers.Contract(
        feedContractAddress,
        feedContractAbi.abi,
        provider
      );
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const marketPlaceContract = new ethers.Contract(
        marketPlaceContractAddress,
        marketPlaceContractAbi.abi,
        );

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

    } catch(error) {
      console.log(error)
    }
  }

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
  return(
    <div className='marketplace'>
        <p className='marketplace__title'>Explore, Create & Collect</p>
        <p className='marketplace__description'>the leading mulltichain NFT Marketplace, Home to the next generation of digital creators. Discover the best NFT collections.</p>
        <CosmosNFTs setItem={setItem} setOpenModal={setOpenModal}>
          {events?.map((nft, index) => (
              <CosmosNFT key={index} nft={nft} />
            ))}
        </CosmosNFTs>
        {openModal && (
        <CosmosModal>
          <CosmosNFTDetails item={item} setOpenModal={setOpenModal} />
        </CosmosModal>
      )}
    </div>
  )

  async function filterSaleForItems(itemsForSale, purchasedItems) {
    let boughtItems = [];
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
  
}