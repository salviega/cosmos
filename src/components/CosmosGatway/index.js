import "./CosmosGateway.scss";
import { ethers } from "ethers";
import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { toast, ToastContainer } from "react-toastify";

export function CosmosGateway() {
  const { user } = useAuth();
  const contracts = useContracts();
  let amount = useRef();
  const email = useRef();
  const [loading, setLoading] = useState(false);

  const onError = (error) => {
    toast("❌ Error...", {
      type: "default",
      pauseOnHover: false,
    });
    setLoading(false);
    console.error("❌", error);
  };

  const onRequestPayOut = async (event) => {
    event.preventDefault();
    const { contract: cosmoContract, biconomy } = await contracts.cosmoContract;
    const { contract: paymentGatewayContract } =
      await contracts.paymentGatewayContract;
    const info = {
      email: email.current.value,
      amount: amount.current.value,
    };

    amount = ethers.utils.parseEther(info.amount, "ether");
    // try {
    //setLoading(true);
    // const { data } =
    //   await cosmoContract.populateTransaction.authorizeOperator(
    //     paymentGatewayContract.address
    //   );
    // let txParams = {
    //   data: data,
    //   to: cosmoContract.address,
    //   from: user.walletAddress,
    //   signatureType: "EIP712_SIGN",
    // };
    // biconomy.provider
    //   .send("eth_sendTransaction", [txParams])
    //   .then(async (response) => {
    //     setTimeout(async () => {
    //       if (response.name !== "Error") {
    //         console.log("♻️ Response: ", response);
    const { data } =
      await paymentGatewayContract.populateTransaction.requestPayOut(
        "0x022EEA14A6010167ca026B32576D6686dD7e85d2", // Oracule
        "d9d827f01e53462b84efbeaab08c7061", // job ID
        info.email,
        amount,
        info.amount,
        { gasLimit: 250000 }
      );

    let txParams = {
      data: data,
      to: paymentGatewayContract.address,
      from: user.walletAddress,
      gasLimit: 250000,
      gas: 250000,
    };

    biconomy.provider
      .send("eth_sendTransaction", [txParams])
      .then((response2) => {
        setTimeout(async () => {
          if (response2.name !== "Error") {
            console.log("♻️ Response: ", response2);
            toast(`💸 Reedemed $${info.amount}`, {
              type: "default",
              pauseOnHover: false,
            });
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            return;
          }
          onError(new Error(response2.message));
        }, 1200);
      })
      .catch((error) => {
        onError(error);
      });
    //   onError(response);
    // }, 2000);
    // })
    // .catch((error) => {
    //   onError(error);
    // });
    // } catch (error) {
    //   onError(error);
    // }
  };

  if (user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="faucet">
      <p className="faucet__title">Pasarela de pagos</p>
      <p className="faucet__description">
        Convierte tus Cosmos en dólares, te llegaran a tu cuenta de Paypal
      </p>
      {loading ? (
        <div className="faucet__loading">
          <CosmosLoading />
        </div>
      ) : (
        <form className="faucet-form" onSubmit={onRequestPayOut}>
          <span>
            <p className="faucet-form__subtitle">Correo electrónico</p>

            <input
              className="faucet-form__add"
              ref={email}
              type="email"
              required
            />
          </span>
          <span>
            <p className="faucet-form__subtitle">Cosmos</p>
            <input className="faucet-form__add" ref={amount} required min="1" />
          </span>
          <div className="faucet-form-container">
            <button className="faucet-form__submit">Canjear</button>
          </div>
        </form>
      )}
      <ToastContainer autoClose={3000} closeOnClick />
    </div>
  );
}
