import { ethers } from "ethers";
import React from 'react';
import './App.scss';
import { firebaseApi } from '../../middleware/firebaseApi';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CosmosHome } from '../CosmosHome';
import { CosmosMenu } from '../CosmosMenu';
import { CosmosWallet } from '../CosmosWallet';
import { CosmosMaker } from '../CosmosMaker'
import { CosmosFooter } from '../CosmosFooter';
import { CosmosMarketplace } from '../CosmosMarketplace';
import { CosmosEventDetails } from '../CosmosEventDetails';

function App() {
  const { getAllItems, getItem, createItem} = firebaseApi()
  const auth = useAuth();
  const [items, setItems] = React.useState()
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [sincronized, setSincronized] = React.useState(true)

  const data = async () => {
    try {
      setItems(await getAllItems())
      setLoading(false)
      setSincronized(true)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error(error)
    }
  }

  React.useEffect(() => {
    data()
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
  }, [sincronized]);

  return (
    <React.Fragment>
      <CosmosMenu>
        <CosmosWallet />
      </CosmosMenu>
      <main>
          <Routes>
            <Route path="/" element={<CosmosHome items={items} loading = {loading} error={error}/>} />
            <Route path="/:slug" element={<CosmosEventDetails getItem={getItem}/>} />
            <Route path="/create" element={<CosmosMaker createItem={createItem} setSincronized={setSincronized}/>} />
            <Route path="/marketplace" element={<CosmosMarketplace />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
      </main>
      <CosmosFooter />
    </React.Fragment>
  );
}

export default App;
