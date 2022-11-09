import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useContractContext } from "./useContractContext";

const CosmosContext = React.createContext();

export function CosmosProvider({ children }) {
  const { user, login, logout, getWeb3Auth, web3Provider, web3Signer } =
    useAuthContext();
  const {
    feedContract,
    _cosmoContract,
    _marketPlaceContract,
    _benefitsContract,
    _paymentGatewayContract,
  } = useContractContext();

  const cosmoContract = _cosmoContract(web3Signer);
  const marketPlaceContract = _marketPlaceContract(web3Signer);
  const benefitsContract = _benefitsContract(web3Provider);
  const paymentGatewayContract = _paymentGatewayContract(web3Signer);

  return (
    <CosmosContext.Provider
      value={{
        user,
        login,
        logout,
        getWeb3Auth,
        web3Provider,
        web3Signer,
        feedContract,
        cosmoContract,
        marketPlaceContract,
        benefitsContract,
        paymentGatewayContract,
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
  const { user, login, logout, getWeb3Auth } = React.useContext(CosmosContext);
  const auth = { user, login, logout, getWeb3Auth };
  return auth;
}

export function useContracts() {
  const {
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
  } = React.useContext(CosmosContext);
  const contracts = {
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
  };
  return contracts;
}
