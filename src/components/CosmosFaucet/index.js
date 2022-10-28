import "./CosmosFaucet.scss";
import logo from "../../asserts/images/logo-cosmos.png";
import React, { useReducer } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { reducerFaucet } from "../../hooks/reducer";

export function CosmosFaucet(props) {
  const auth = useAuth();
  const contracts = useContracts();
  const { initialValue, reducerObject, actionTypes } = reducerFaucet();
  const [state, dispatch] = useReducer(reducerObject, initialValue);
  const { amount, error, loading } = state;
  const address = React.useRef();

  // ACTIONS CREATORS
  const onError = (error) => dispatch({ type: actionTypes.error, payload: error });
  const onLoading = () => dispatch({ type: actionTypes.loading });
  const onSuccess = () => dispatch({ type: actionTypes.success });

  const onSafeMint = async (event) => {
    try {
      event.preventDefault();
      onLoading();
      
      const info = {
        address: address.current.value,
        amount,
      };
      
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.marketPlaceContract.address
      );
      
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.cosmoContract.safeMint(
            info.address,
            info.amount
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                onSuccess();
                alert("Fueron añadidos 10 cosmos a su billetera");
              }, 3000);
            })
            .catch((error) => {
              onError(error);
              alert("Hubo un error, revisa la consola");
              console.error(error);
            });
        })
        .catch((error) => {
          onError();
          alert("Hubo un error, revisa la consola");
          console.error(error);
        });
    } catch (error) {
      onError();
      alert("Hubo un error, revisa la consola");
      console.error(error);
    }
  };

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="faucet">
      <p className="faucet__title">Faucet</p>
      <p className="faucet__description">
        Retira todos los Cosmos que quieras.
      </p>
      {error && "Hubo un error... mira la consola"}
      {loading && !error && (
        <div className="faucet__loading">
          <CosmosLoading />
        </div>
      )}
      {!loading && !error && (
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
    </div>
  );
}
