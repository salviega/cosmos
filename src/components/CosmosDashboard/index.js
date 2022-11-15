import "./CosmosDashboard.scss";
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
import { CosmosModal } from "../../shared/CosmosModal";
import { CosmosDashboardNFTDetails } from "./CosmosDashboardNFTDetails";
import { CosmosTransfer } from "./CosmosTransfer";

export function CosmosDashboard() {
  const auth = useAuth();
  const contracts = useContracts();
  const dashboardInfo = useDashboardInfo();
  const [loading, setLoading] = useState(true);
  const [sincronized, setSincronized] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [imageBase64, setImageBase64] = useState("");
  const [graphInformation, setGraphInformation] = useState([]);
  const [NFTs, setNFTs] = useState([]);
  const [item, setItem] = useState({});
  const [counter, setCounter] = useState(0);
  const [reedemedToken, setRedeemToken] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModalTransfer, setOpenModalTransfer] = useState(false);
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
  const { getNotifications } = pushProtocolRestApi();

  const onRedeemTokens = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://cyclimate-backend-node.herokuapp.com/redeem"
      );
      const data = response.data;
      console.log(data);
      alert("Revisa la consola");
      setRedeemToken(data);
      setSincronized(false);
    } catch (error) {
      console.error(error);
      alert("hubo un error revisa la consola");
      setSincronized(false);
    }
  };

  const getPackagesData = async () => {
    try {
      const response = await axios.get(
        "https://cyclimate-backend-node.herokuapp.com/counter"
      );
      const data = response.data;
      setCounter(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getGraphInfo = async () => {
    try {
      const response = await axios.get(
        "https://cyclimate-backend-node.herokuapp.com/lastest"
      );
      const data = response.data;
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
    try {
      const response = await axios.get(
        "https://cyclimate-backend-node.herokuapp.com/allNFTs",
        {
          params: {
            address: contracts.marketPlaceContract.address,
            wallet: auth.user.walletAddress,
          },
        }
      );

      return await response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const perfilInformation = () => {
    if (userInformation.name) {
      return (
        <>
          <div className="dashboard-personal-data">
            <div className="dashboard-personal-data-info">
              <p>name: {userInformation.name}</p>
              <p>email: {userInformation.email}</p>
              <p>chainId: {userInformation.chainId}</p>
              <p>wallet: {userInformation.wallet}</p>
              <p>balance: {userInformation.balance}</p>
              <p>Cosmos: {userInformation.cosmos}</p>
              <p>private key: {userInformation.privateKey}</p>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="dashboard-personal-data">
          <div className="dashboard-personal-data-info">
            <p>wallet: {userInformation.wallet}</p>
            <p>balance: {userInformation.balance}</p>
            <p>Cosmos: {userInformation.cosmos}</p>
            <p>chainId: {userInformation.chainId}</p>
          </div>
        </div>
      </>
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
        const user = {
          name: userInfo.name || null,
          email: userInfo.email || null,
          chainId: await dashboardInfo.getChainId,
          wallet: await dashboardInfo.getAccounts,
          balance: balance.toFixed(4),
          cosmos,
          privateKey: (await dashboardInfo.getPrivateKey) || null,
        };
        Object.keys(user).map((attribute) => {
          if (user[attribute] === null) {
            delete user[attribute];
          }
        });
        getPackagesData();
        setNFTs(await getNFTInfo());
        getGraphInfo();
        setUserInformation(user);
        setNotifications(response);
        setLoading(false);
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
    <>
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
          <div className="dashboard-sensor">
            <CosmosLineGraph graphInformation={graphInformation} />
            <div className="dashboard-sensor-redeem">
              <h2>
                Redime {counter} COSMOS por el total de tus datos recolectados
              </h2>
              {counter !== 0 && (
                <button onClick={onRedeemTokens}>Redeem</button>
              )}
            </div>
          </div>
          <h2 className="dashboard-notifications__title">My NFTs</h2>

          <CosmosDashboardNFTs
            contracts={contracts}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setItem={setItem}
            setOpenModal={setOpenModal}
            setOpenModalTransfer={setOpenModalTransfer}
          >
            {NFTs
              ? NFTs.map((item, index) => (
                  <CosmosDashboardNFT key={index} item={item} />
                ))
              : "There don't NFTs"}
          </CosmosDashboardNFTs>
        </div>
      )}
      {openModal && (
        <CosmosModal>
          <CosmosDashboardNFTDetails
            item={item}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setOpenModal={setOpenModal}
            setOpenModalTransfer={setOpenModalTransfer}
          />
        </CosmosModal>
      )}
      {openModalTransfer && (
        <CosmosModal>
          <CosmosTransfer
            item={item}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setOpenModal={setOpenModal}
            setOpenModalTransfer={setOpenModalTransfer}
          />
        </CosmosModal>
      )}
    </>
  );
}
