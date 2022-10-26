import "./CosmosGateway.scss";
import React from "react";
import { ethers } from "ethers";
import { useContracts } from "../CosmosContext";
import { CosmosLoading } from "../../shared/CosmosLoading";

export function CosmosGateway() {
  const contracts = useContracts();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const email = React.useRef();
  let amount = React.useRef();

  const changeCurrency = async (event) => {
    event.preventDefault();
    amount = ethers.utils.parseEther(amount.current.value, "ether");
    const info = {
      email: email.current.value,
      amount: parseInt(amount) * 10 ** 18,
    };
    setLoading(true);

    try {
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.paymentGatewayContract.address
      );
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 =
            await contracts.paymentGatewayContract.requestPayOut(
              "0x022EEA14A6010167ca026B32576D6686dD7e85d2",
              "d9d827f01e53462b84efbeaab08c7061",
              info.email,
              amount,
              info.amount,
              { gasLimit: 2500000 }
            );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                alert("Fueron cambiados tus cosmos a dólares");
                setLoading(false);
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              setError(true);
            });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setError(true);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="faucet">
      <p className="faucet__title">Pasarela de pagos</p>
      <p className="faucet__description">
        Convierte tus Cosmos en dólares, te llegaran a tu cuenta de Paypal
      </p>
      {error && "Hubo un error... mira la consola"}
      {loading && !error && (
        <div className="faucet__loading">
          <CosmosLoading />
        </div>
      )}
      {!loading && !error && (
        <form className="faucet-form" onSubmit={changeCurrency}>
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
    </div>
  );
}
