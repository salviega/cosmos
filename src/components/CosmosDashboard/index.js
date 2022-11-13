import "./CosmosDashboard.scss";
import defaultImage from "../../assets/images/default-image.jpg";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { pushProtocolRestApi } from "../../middleware/pushProtocolRestApi";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { useAuth, useContracts, useDashboardInfo } from "../../hooks/context";
import { Navigate } from "react-router-dom";
import { ethers } from "ethers";
import { CosmosLineGraph } from "./CosmosGraph";
import { CosmosNotifications } from "./CosmosNotifications";
import { CosmosDashboardNFTs } from "./CosmosDashboardNFTs";
import { CosmosDashboardNFT } from "./CosmosDashboardNFT";

export function CosmosDashboard() {
  const auth = useAuth();
  const contracts = useContracts();
  const dashboardInfo = useDashboardInfo();
  const [loading, setLoading] = React.useState(true);
  const [sincronized, setSincronized] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);
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
  const [NFTs, setNFTs] = useState([]);
  const { getNotifications } = pushProtocolRestApi();
  const [item, setItem] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModalSummary, setOpenModalSummary] = useState(false);

  const getGraphInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8080/lastest");
      const data = await response.data;
      const refactoredData = data.map((datum) => {
        return {
          x: datum.DATE_C,
          y: datum.CO2,
        };
      });
      setGraphInformation(refactoredData);
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTInfo = async () => {
    const response = await axios.get(`http://localhost:8080/allNFTs`, {
      params: {
        address: contracts.marketPlaceContract.address,
        wallet: auth.user.walletAddress,
      },
    });
    setNFTs(response.data);
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
        <aside className="dashboard-personal-data">
          <div className="dashboard-personal-data-image">
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
      <React.Fragment>
        <div className="dashboard-personal-data">
          <figure className="dashboard-personal-data-image">
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
          <div className="dashboard-personal-data-info">
            <p>wallet: {userInformation.wallet}</p>
            <p>balance: {userInformation.balance}</p>
            <p>Cosmos: {userInformation.cosmos}</p>
            <p>chainId: {userInformation.chainId}</p>
          </div>
        </div>
      </React.Fragment>
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
        getNFTInfo();
        getGraphInfo();
        setUserInformation(user);
        setNotifications(response);
        setLoading(false);
        setSincronized(true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [sincronized]);

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
          <div className="dashboard-personal">
            {perfilInformation()}
            <div className="dashboard-notifications">
              <h1 className="dashboard-notifications__title">Notifications</h1>
              <CosmosNotifications notifications={notifications} />
            </div>
          </div>
          <CosmosLineGraph graphInformation={graphInformation} />
          <h1 className="dashboard-notifications__title">My NFTs</h1>

          <CosmosDashboardNFTs
            contracts={contracts}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setItem={setItem}
            setOpenModal={setOpenModal}
          >
            {NFTs
              ? NFTs?.map((NFT, index) => (
                  <>
                    <CosmosDashboardNFT key={index} item={NFT} />
                  </>
                ))
              : "There don't NFTs"}
          </CosmosDashboardNFTs>
        </div>
      )}
    </React.Fragment>
  );
}
