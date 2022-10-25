import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useContractContext } from "./useContractContext";

const CosmosContext = React.createContext();

export function CosmosProvider({ children }) {
  const { user, login, logout } = useAuthContext();
  const {
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
  } = useContractContext();

  return (
    <CosmosContext.Provider
      value={{
        user,
        login,
        logout,
        web3Provider,
        web3Signer,
        feedContract,
        cosmoContract,
        marketPlaceContract,
        benefitsContract,
      }}
    >
      {children}
    </CosmosContext.Provider>
  );
}

export function AuthRoute(props) {
  const auth = useAuth();

  if (!auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return props.children;
}

export function useAuth() {
  const { user, login, logout } = React.useContext(CosmosContext);
  const auth = { user, login, logout };
  return auth;
}

export function useContracts() {
  const { web3Provider, web3Signer, feedContract, cosmoContract, marketPlaceContract, benefitsContract } =
    React.useContext(CosmosContext);
  const contracts = {
    web3Provider, 
    web3Signer, 
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
  };
  return contracts;
}
