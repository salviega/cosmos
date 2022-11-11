import "./CosmosFaucet.scss";
import logo from "../../asserts/images/logo-cosmos.png";
import * as PushAPI from "@pushprotocol/restapi";
import { NotificationItem } from "@pushprotocol/uiweb";
import { ethers } from "ethers";
import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CosmosLoading } from "../../shared/CosmosLoading";

export function CosmosFaucet() {
  const auth = useAuth();
  const contracts = useContracts();
  const address = useRef();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotificactions] = useState([]);
  const amount = ethers.utils.parseEther("10", "ether");

  const onError = (error) => {
    alert("Hubo un error, revisa la consola");
    setLoading(false);
    console.error(error);
  };

  const onSafeMint = async (event) => {
    event.preventDefault();

    const info = {
      address: address.current.value,
      amount,
    };

    try {
      setLoading(true);

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
                setLoading(false);
                alert("Fueron añadidos 10 cosmos a su billetera");
              }, 3000);
            })
            .catch((error) => {
              onError(error);
            });
        })
        .catch((error) => {
          onError(error);
        });
    } catch (error) {
      onError();
    }
  };

  const getNotifications = async () => {
    setNotificactions(
      await PushAPI.user.getFeeds({
        user: "eip155:5:0x70a792ad975aa0977c6e9d55a14f5f2228bbc685",
        env: "staging",
      })
    );
  };

  React.useEffect(() => {
    getNotifications();
  }, []);

  if (auth.user.walletAddress === "Connect wallet") {
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
      <div>
        {notifications.map((oneNotification, index) => {
          const {
            cta,
            title,
            message,
            app,
            icon,
            image,
            url,
            blockchain,
            notification,
          } = oneNotification;

          return (
            <NotificationItem
              key={index} // any unique id
              notificationTitle={title}
              notificationBody={message}
              cta={cta}
              app={app}
              icon={icon}
              image={image}
              url={url}
              theme="dark"
              chainName={blockchain}
              notification={notification}
            />
          );
        })}
      </div>
    </div>
  );
}
