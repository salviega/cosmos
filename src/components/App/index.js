import "./App.scss";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
const clientId =
  "BIUsf57Ux9ezViHnb5VEAnK2nX6nVRv2Kw-jom21XqvBqr22cDQBi3MdsOzHnMtzRSaoybCUhhGf4YMc0llIQpk";

function App() {
  const auth = useAuth();
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

  const init = async () => {
    try {
      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xA869",
          rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc",
          displayName: "Avalanche FUJI C-Chain",
          blockExplorer: "testnet.snowtrace.io",
          ticker: "AVAX",
          tickerName: "AVAX",
        },
        uiConfig: {
          appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
          theme: "dark",
          loginMethodsOrder: [
            "google",
            "facebook",
            "twitter",
            "email_passwordless",
          ],
          defaultLanguage: "en",
        },
      });

      await web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: {
              reddit: {
                showOnModal: false,
              },
              github: {
                showOnModal: false,
              },
              linkedin: {
                showOnModal: false,
              },
              twitch: {
                showOnModal: false,
              },
              line: {
                showOnModal: false,
              },
              kakao: {
                showOnModal: false,
              },
              weibo: {
                showOnModal: false,
              },
              wechat: {
                showOnModal: false,
              },
            },
            showOnModal: true,
          },
        },
      });

      auth.getWeb3Auth(web3auth);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    init();
    fetchData();
  }, [sincronizedItems]);

  return (
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
          <Route
            path="/approve/:slug"
            element={<CosmosApprove getItem={getItem} />}
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <CosmosFooter />
    </>
  );
}

export default App;
