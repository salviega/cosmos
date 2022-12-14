import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useContractContext } from "./useContractContext";
import { useDashboardInfoContext } from "./useDashboardInfoContext";

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
    paymentGatewayContract,
  } = useContractContext();

  const { _getChainId, _getAccounts, _getBalance } = useDashboardInfoContext();

  const getChainId = _getChainId(web3Provider);
  const getAccounts = _getAccounts(web3Signer);
  const getBalance = _getBalance(web3Provider);

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
        paymentGatewayContract,
        getChainId,
        getAccounts,
        getBalance,
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

export function useDashboardInfo() {
  const { getChainId, getAccounts, getBalance } =
    React.useContext(CosmosContext);
  const dashboardInfo = {
    getChainId,
    getAccounts,
    getBalance,
  };
  return dashboardInfo;
}
