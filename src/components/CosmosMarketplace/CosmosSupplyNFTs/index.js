import "./CosmosSupplyNFTs.scss";
import React, { useRef } from "react";
import { ethers } from "ethers";
import { useAuth } from "../../../hooks/context";
import { toast, ToastContainer } from "react-toastify";

export function CosmosSupplyNFTs({
  contracts,
  tokenIdCounter,
  onLoading,
  onSincronizedItems,
}) {
  const { user } = useAuth();
  const price = useRef();
  const tokenURI = useRef();
  const tokenId = useRef();
  const artistWallet = useRef();
  const taxFee = useRef();

  const onError = (error) => {
    toast("❌ Error...", {
      type: "default",
      pauseOnHover: false,
    });
    onSincronizedItems();
    console.error("❌", error);
  };

  const putInSale = async (event) => {
    event.preventDefault();
    const { contract: cosmoContract } = await contracts.cosmoContract;
    const { contract: marketPlaceContract, biconomy } =
      await contracts.marketPlaceContract;
    let roundPrice = Math.round(Number(price.current.value));
    roundPrice = ethers.utils.parseEther(roundPrice.toString(), "ether");
    let parsedTaxFee = parseInt(taxFee.current.value);
    parsedTaxFee = (parsedTaxFee * roundPrice) / 100;
    parsedTaxFee = ethers.utils.parseEther(parsedTaxFee.toString(), "ether");
    const parsedTokenId = parseInt(tokenId.current.value);

    // try {
    //onLoading();
    const { data } = await marketPlaceContract.populateTransaction.mint(
      tokenURI.current.value,
      artistWallet.current.value,
      parsedTaxFee,
      cosmoContract.address,
      { gasLimit: 250000 }
    );

    let txParams = {
      data: data,
      gasLimit: 250000,
      to: marketPlaceContract.address,
      from: user.walletAddress,
    };

    biconomy.provider
      .send("eth_sendTransaction", [txParams])
      .then(async (response) => {
        if (response.name !== "Error") {
          console.log("♻️ Response: ", response);
          const { data: data2 } = await marketPlaceContract.approve(
            marketPlaceContract.address,
            parsedTokenId
          );

          txParams = {
            data: data2,
            to: marketPlaceContract.address,
            from: user.walletAddress,
            signatureType: "EIP712_SIGN",
          };

          biconomy.provider
            .send("eth_sendTransaction", [txParams])
            .then(async (response) => {
              if (response.name !== "Error") {
                console.log("♻️ Response: ", response);
                const { data: data3 } = await marketPlaceContract.sellItem(
                  marketPlaceContract.address,
                  parsedTokenId,
                  roundPrice
                );

                txParams = {
                  data: data3,
                  to: marketPlaceContract.address,
                  from: user.walletAddress,
                  signatureType: "EIP712_SIGN",
                };

                biconomy.provider
                  .send("eth_sendTransaction", [txParams])
                  .then(async (response3) => {
                    if (response3.name !== "Error") {
                      console.log("♻️ Response: ", response);
                      toast(`👾 It's on sale NFT`, {
                        type: "default",
                        pauseOnHover: false,
                      });
                      setTimeout(() => {
                        onSincronizedItems();
                      }, 1600);
                      return;
                    }
                  });
              }
              return;
            })
            .catch((error) => {
              onError(error);
            });
          return;
        }
        onError(new Error(response.message));
      })
      .catch((error) => {
        onError(error);
      });
    // } catch (error) {
    //   onError(error);
    // }
  };

  return (
    <div className="supply">
      <h1 className="supply__title">Sell NFT</h1>
      <form className="supply-form" onSubmit={putInSale}>
        <span>
          <p className="supply-form__subtitle">Add the price in COSMOS: </p>
          <input
            className="supply-form__add"
            type="number"
            required
            min="1"
            step="0.01"
            ref={price}
          />
        </span>
        <span>
          <p className="supply-form__subtitle">Add the token ID: </p>
          <input
            className="supply-form__add"
            type="number"
            required
            min="0"
            step="0"
            ref={tokenId}
          />
        </span>
        <span>
          <p className="supply-form__subtitle">
            Add the metadata of the new NFT:{" "}
          </p>
          <input
            className="supply-form__add"
            type="url"
            required
            ref={tokenURI}
          />
        </span>
        <span>
          <p className="supply-form__subtitle">Wallet of the artist: </p>
          <input
            className="supply-form__add"
            type="text"
            required
            ref={artistWallet}
          />
        </span>
        <span>
          <p className="supply-form__subtitle">% Fee of the artist: </p>
          <input
            className="supply-form__add"
            type="number"
            required
            min="1"
            step="1"
            max="100"
            ref={taxFee}
          />
        </span>
        <div className="supply-form-create">
          <button className="supply-form-create__submit">Create NFT</button>
          <p className="supply-form-create__idCounter">
            {" "}
            currency token ID: {tokenIdCounter}
          </p>
        </div>
      </form>
      <ToastContainer autoClose={1400} closeOnClick />
    </div>
  );
}
