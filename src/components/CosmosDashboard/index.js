import "./CosmosDashboard.scss";
import defaultImage from "../../assets/images/default-image.jpg";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import { pushProtocolRestApi } from "../../middleware/pushProtocolRestApi";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { useAuth, useContracts, useDashboardInfo } from "../../hooks/context";
import { Navigate } from "react-router-dom";
import { ethers } from "ethers";
import { CosmosLineGraph } from "./CosmosGraph";

export function CosmosDashboard() {
  const auth = useAuth();
  const contracts = useContracts();
  const dashboardInfo = useDashboardInfo();
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState();
  const [imageBase64, setImageBase64] = React.useState("");
  const initialState = {
    name: "",
    email: "",
    chainId: "",
    wallet: "",
    balance: "",
    cosmos: "",
    privateKey: "",
  };
  const [userInformation, setUserInformation] = useState(initialState);
  const [graphInformation, setGraphInformation] = useState([]);
  const { getNotifications } = pushProtocolRestApi();

  const getGraphInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/", { mode: "cors" });
      const data = await response.json();
      console.log({ data });
    } catch (e) {
      console.log(e);
    }
  };

  const handleImage = (event) => {
    const files = event.target.files;
    const file = files[0];
    // setImage(file);
    // let typefile = file.type;
    // typefile = typefile.split("/");
    // setTypeImage(typefile[1]);
    // getBase64(file, setImageBase64);
  };

  const perfilInformation = () => {
    if (userInformation.name) {
      return (
        <aside className="dashboard-personal">
          <div className="dashboard-personal-image">
            <figure>
              <img
                src={imageBase64 === "" ? defaultImage : imageBase64}
                alt="default"
              />
              <figcaption>
                <input
                  className="maker-form-image__upgrade"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={handleImage}
                />
              </figcaption>
            </figure>
          </div>
          <p>name: {userInformation.name}</p>
          <p>email: {userInformation.email}</p>
          <p>chainId: {userInformation.chainId}</p>
          <p>wallet: {userInformation.wallet}</p>
          <p>balance: {userInformation.balance}</p>
          <p>Cosmos: {userInformation.cosmos}</p>
          <p>private key: {userInformation.privateKey}</p>
        </aside>
      );
    }
    return (
      <aside className="dashboard-personal">
        <div className="dashboard-personal-image">
          <figure>
            <img
              src={imageBase64 === "" ? defaultImage : imageBase64}
              alt="default"
            />
            <figcaption>
              <input
                className="maker-form-image__upgrade"
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={handleImage}
              />
            </figcaption>
          </figure>
        </div>
        <div className="dashboard-personal-info">
          <p>wallet: {userInformation.wallet}</p>
          <p>balance: {userInformation.balance}</p>
          <p>Cosmos: {userInformation.cosmos}</p>

          <p>chainId: {userInformation.chainId}</p>
        </div>
      </aside>
    );
  };

  useEffect(() => {
    getNotifications(auth.user.walletAddress)
      .then(async (response) => {
        let cosmos = await contracts.cosmoContract.balanceOf(
          auth.user.walletAddress
        );
        cosmos = ethers.utils.formatEther(cosmos);
        const userInfo = await dashboardInfo.getUserInfo;
        let balance = await dashboardInfo.getBalance;
        balance = parseFloat(balance);
        let user = {
          name: userInfo.name || null,
          email: userInfo.email || null,
          chainId: await dashboardInfo.getChainId,
          wallet: await dashboardInfo.getAccounts,
          balance: balance.toFixed(4),
          cosmos: cosmos,
          privateKey: (await dashboardInfo.getPrivateKey) || null,
        };
        Object.keys(user).map((attribute) => {
          if (user[attribute] === null) {
            delete user[attribute];
          }
        });
        getGraphInfo();
        setUserInformation(user);
        setNotifications(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      {loading ? (
        <div className="main__loading">
          <CosmosLoading />
        </div>
      ) : (
        <div className="dashboard">
          {perfilInformation()}
          <div className="dashboard-notifications">
            <h1 className="dashboard-notifications__title">Notifications</h1>
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
                  key={index}
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
          <CosmosLineGraph />
        </div>
      )}
    </React.Fragment>
  );
}
