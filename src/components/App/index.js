import { ethers } from "ethers";
import React from 'react';
import './App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CosmosHome } from '../CosmosHome';
import { CosmosMenu } from '../CosmosMenu';
import { CosmosWallet } from '../CosmosWallet';
import { CosmosMaker } from '../CosmosMaker'
import { CosmosFooter } from '../CosmosFooter';

function App() {
  const auth = useAuth();

  React.useEffect(() => {
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
  });

  return (
    <React.Fragment>
      <CosmosMenu>
        <CosmosWallet />
      </CosmosMenu>
      <main>
          <Routes>
            <Route path="/" element={<CosmosHome />} />
            {/* <Route path="/:slug" element={<CosmosEvent/>} /> */}
            <Route path="/create" element={<CosmosMaker />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
      </main>
      <CosmosFooter />
    </React.Fragment>
  );
}

export default App;
