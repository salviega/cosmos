import { ethers } from "ethers";

export function useDashboardInformationContext() {
  const _getUserInfo = (web3Auth) => {
    if (web3Auth) {
      if (!web3Auth.getUserInfo() === {}) {
        return web3Auth.getUserInfo();
      }
      return null;
    }
  };

  const _getChainId = async (web3Provider) => {
    if (web3Provider) {
      const detailsNetwork = await web3Provider?.getNetwork();
      return detailsNetwork?.chainId;
    }
  };

  const _getAccounts = async (web3Signer) => {
    if (web3Signer) {
      return await web3Signer.getAddress();
    }
  };

  const _getBalance = async (web3Provider) => {
    if (web3Provider) {
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      return ethers.utils.formatEther(
        await web3Provider.getBalance(address) // eth
      );
    }
  };

  const _getPrivateKey = async (web3Provider) => {
    if (web3Provider) {
      if (
        web3Provider.provider.request({
          method: "eth_private_key",
        })
      ) {
        return await web3Provider.provider.request({
          method: "eth_private_key",
        });
      }
      return null;
    }
  };

  return {
    _getUserInfo,
    _getChainId,
    _getAccounts,
    _getBalance,
    _getPrivateKey,
  };
}
