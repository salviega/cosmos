import "./CosmosFaucet.scss";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/logo-cosmos.png";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { toast, ToastContainer } from "react-toastify";

export function CosmosFaucet() {
  const { user } = useAuth();
  const contracts = useContracts();
  const address = useRef();
  const [loading, setLoading] = useState(false);
  const amount = ethers.utils.parseEther("10", "ether");

  const onError = (error) => {
    toast("❌ Error...", {
      type: "default",
      pauseOnHover: false,
    });
    setLoading(false);
    console.error("❌", error);
  };

  const onSafeMint = async (event) => {
    event.preventDefault();
    const { contract: cosmoContract, biconomy } = await contracts.cosmoContract;
    const { contract: marketPlaceContract } =
      await contracts.marketPlaceContract;
    const info = {
      address: address.current.value,
      amount,
    };

    try {
      setLoading(true);

      const { data } =
        await cosmoContract.populateTransaction.authorizeOperator(
          marketPlaceContract.address
        );
      let txParams = {
        data: data,
        to: cosmoContract.address,
        from: user.walletAddress,
        signatureType: "EIP712_SIGN",
      };

      const response = await biconomy.provider.send("eth_sendTransaction", [
        txParams,
      ]);
      if (response.name !== "Error") {
        console.log("♻️ Response: ", response);
      } else {
        onError(new Error(response.message));
        return;
      }
      setTimeout(async () => {
        const { data: data2 } =
          await cosmoContract.populateTransaction.safeMint(
            info.address,
            ethers.utils.parseEther("10", "ether")
          );

        txParams = {
          data: data2,
          to: cosmoContract.address,
          from: user.walletAddress,
          signatureType: "EIP712_SIGN",
        };

        const response2 = await biconomy.provider.send("eth_sendTransaction", [
          txParams,
        ]);
        if (response.name !== "Error") {
          console.log("♻️ Response: ", response2);
          toast("💰 Mintend 10 cycli", {
            type: "default",
            pauseOnHover: false,
          });
          setTimeout(() => {
            setLoading(false);
          }, 1200);
        } else {
          onError(new Error(response2.message));
          return;
        }
      }, 5000);
    } catch (error) {
      onError(error);
    }
  };

  if (user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="faucet">
      <p className="faucet__title">Faucet</p>
      <p className="faucet__description">
        Retira todos los Cosmos que quieras.
      </p>
      {loading ? (
        <div className="faucet__loading">
          <CosmosLoading />
        </div>
      ) : (
        <form className="faucet-form" onSubmit={onSafeMint}>
          <span>
            <p className="faucet-form__subtitle">Dirección de billetera</p>
            <input
              className="faucet-form__add"
              ref={address}
              type="text"
              required
            />
          </span>
          <div className="faucet-form-container">
            <figure>
              <img src={logo} alt="logo" />
            </figure>
            <button className="faucet-form__submit">Redime 10 CMS</button>
          </div>
        </form>
      )}
      <ToastContainer autoClose={1400} closeOnClick />
    </div>
  );
}
