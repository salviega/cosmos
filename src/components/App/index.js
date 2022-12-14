import "./App.scss";
import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/context";
import { CosmosHome } from "../CosmosHome";
import { CosmosMenu } from "../../shared/CosmosMenu";
import { CosmosWallet } from "../../shared/CosmosMenu/CosmosWallet";
import { CosmosMaker } from "../CosmosMaker";
import { CosmosFooter } from "../../shared/CosmosFooter";
import { CosmosMarketplace } from "../CosmosMarketplace";
import { CosmosEventDetails } from "../CosmosHome/CosmosEventDetails";
import { CosmosFaucet } from "../CosmosFaucet";
import { CosmosGateway } from "../CosmosGatway";
import { CosmosApprove } from "../CosmosApprove";
import { firebaseApi } from "../../middleware/firebaseApi";
import { CosmosLoading } from "../../shared/CosmosLoading";
import { CosmosDashboard } from "../CosmosDashboard";
import { ethers } from "ethers";

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { getAllItems, getItem, createItem } = firebaseApi();
  const [items, setItems] = React.useState();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);

  const fetchData = async () => {
    try {
      setItems(await getAllItems());
      setLoading(false);
      setSincronizedItems(true);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchData();
    const currentNetwork = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const chainId = await web3Signer.getChainId();
      return chainId;
    };
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        currentNetwork().then((response) => {
          if (response !== 43113) {
            auth.logout();
          }
        });
      });
      window.ethereum.on("accountsChanged", () => {
        auth.logout();
      });
    }
  }, [sincronizedItems]);

  return (
    <>
      {loading ? (
        <div className="main__loading">
          <CosmosLoading />
        </div>
      ) : (
        <>
          <CosmosMenu>
            <CosmosWallet />
          </CosmosMenu>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <CosmosHome items={items} loading={loading} error={error} />
                }
              />
              <Route
                path="/:slug"
                element={<CosmosEventDetails getItem={getItem} />}
              />
              <Route
                path="/maker"
                element={
                  <CosmosMaker
                    createItem={createItem}
                    setSincronizedItems={setSincronizedItems}
                  />
                }
              />
              <Route path="/marketplace" element={<CosmosMarketplace />} />
              <Route path="/gateway" element={<CosmosGateway />} />
              <Route path="/faucet" element={<CosmosFaucet />} />
              <Route path="/dashboard" element={<CosmosDashboard />} />
              <Route
                path="/approve/:slug"
                element={<CosmosApprove getItem={getItem} />}
              />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </main>
          <CosmosFooter />
        </>
      )}
    </>
  );
}

export default App;
