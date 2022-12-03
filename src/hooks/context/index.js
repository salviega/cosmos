import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useContractContext } from "./useContractContext";
import { useDashboardInformationContext } from "./useDashboardInformationContext";

const CosmosContext = React.createContext();

export function CosmosProvider({ children }) {
  const {
    user,
    login,
    logout,
    getWeb3Auth,
    web3Auth,
    web3Provider,
    web3Signer,
  } = useAuthContext();
  const {
    feedContract,
    _cosmoContract,
    _marketPlaceContract,
    _benefitsContract,
    _paymentGatewayContract,
  } = useContractContext();
  const {
    _getUserInfo,
    _getChainId,
    _getAccounts,
    _getBalance,
    _getPrivateKey,
  } = useDashboardInformationContext();

  const cosmoContract = _cosmoContract(web3Auth, web3Signer).then(
    (response) => {
      return response;
    }
  );
  const marketPlaceContract = _marketPlaceContract(web3Auth, web3Signer).then(
    (response) => {
      return response;
    }
  );
  const benefitsContract = _benefitsContract(web3Auth, web3Signer).then(
    (response) => {
      return response;
    }
  );
  const paymentGatewayContract = _paymentGatewayContract(
    web3Auth,
    web3Signer
  ).then((response) => {
    return response;
  });

  const getUserInfo = _getUserInfo(web3Auth);
  const getChainId = _getChainId(web3Provider);
  const getAccounts = _getAccounts(web3Signer);
  const getBalance = _getBalance(web3Provider);
  const getPrivateKey = _getPrivateKey(web3Provider);

  return (
    <CosmosContext.Provider
      value={{
        user,
        login,
        logout,
        getWeb3Auth,
        web3Auth,
        web3Provider,
        web3Signer,
        feedContract,
        cosmoContract,
        marketPlaceContract,
        benefitsContract,
        paymentGatewayContract,
        getUserInfo,
        getChainId,
        getAccounts,
        getBalance,
        getPrivateKey,
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
  const { user, login, logout, web3Auth, getWeb3Auth } =
    React.useContext(CosmosContext);
  const auth = { user, login, logout, web3Auth, getWeb3Auth };
  return auth;
}

export function useContracts() {
  const {
    web3Auth,
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
  } = React.useContext(CosmosContext);
  const contracts = {
    web3Auth,
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
  const { getUserInfo, getChainId, getAccounts, getBalance, getPrivateKey } =
    React.useContext(CosmosContext);
  const dashboardInfo = {
    getUserInfo,
    getChainId,
    getAccounts,
    getBalance,
    getPrivateKey,
  };
  return dashboardInfo;
}
