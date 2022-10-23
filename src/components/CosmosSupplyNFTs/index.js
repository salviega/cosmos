import "./CosmosSupplyNFTs.scss";
import React from "react";
import { ethers } from "ethers";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketPlaceContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;


export function CosmosSupplyNFTs({ tokenIdCounter, setLoading, setSincronizedItems }) {
  const price = React.useRef();
  const tokenURI = React.useRef();
  const tokenId = React.useRef();
  const artistWallet = React.useRef();
  const taxFee = React.useRef();
  
  const putInSale = async (event) => {
    event.preventDefault();
    const roundPrice = Math.round(parseInt(price.current.value));
    const parsedTokenId = parseInt(tokenId.current.value);
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();

      const marketPlaceContract = new ethers.Contract(
        marketPlaceContractAddress,
        marketPlaceContractAbi.abi,
        web3Signer
      );
      const response = await marketPlaceContract.mint(
        tokenURI.current.value,
        artistWallet.current.value,
        taxFee.current.value,
        cosmoContractAddress
      );
      setLoading(true);

      web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await marketPlaceContract.approve(
            marketPlaceContractAddress,
            parsedTokenId
          );
          web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              const response3 = await marketPlaceContract.sellItem(
                marketPlaceContractAddress,
                parsedTokenId,
                roundPrice
              );
              web3Provider
                .waitForTransaction(response3.hash)
                .then((_response3) => {
                  setTimeout(() => {
                    setSincronizedItems(false);
                  }, 3000);
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
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="supply">
      <h1 className="supply__title">Sell NFT</h1>
      <form className="supply-form" onSubmit={putInSale}>
        <div className="supply-form__container">
          <span>
            <p>Add the price in USD: </p>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="10"
              ref={price}
            />
          </span>
          <span>
            <p>Add the token ID: </p>
            <input
              type="number"
              required
              min="0"
              step="0"
              placeholder="1"
              ref={tokenId}
            />
          </span>
          <span>
            <p>Add the metadata of the new NFT: </p>
            <input
              type="url"
              required
              placeholder="https://gateway/ipfs/example-metadata.json"
              ref={tokenURI}
            />
          </span>
          <span>
            <p>Wallet of the artist: </p>
            <input
              type="text"
              required
              placeholder="0x70.....BC685"
              ref={artistWallet}
            />
          </span>
          <span>
            <p>Fee of the artist: </p>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="1"
              ref={taxFee}
            />
          </span>
          <div className="supply-form__create">
            <button>Create NFT</button> <p className="supply-form__idCounter"> currency token ID: {tokenIdCounter}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
