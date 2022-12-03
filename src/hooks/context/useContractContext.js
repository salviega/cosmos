import feedContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json";
import cosmoContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoGaslessContract.sol/CosmoGaslessContract.json";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceGaslessContract.sol/MarketPlaceGaslessContract.json";
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsGaslessContract.sol/BenefitsGaslessContract.json";
import paymentGatewayContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/PaymentGatewayGaslessContract.sol/PaymentGatewayGaslessContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
const feedContractAddress = addresses[0].feedcontract;
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;
const benefitsContractAddress = addresses[3].benefitscontract;
const paymenGatewayContractAddress = addresses[4].paymentgatewaycontract;

export function useContractContext() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_RPC_URL_MUMBAI
  );

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  );

  const _cosmoContract = (web3auth) => {
    return generateContract(
      web3auth,
      cosmoContractAddress,
      cosmoContractAbi.abi
    );
  };

  const _marketPlaceContract = (web3auth) => {
    return generateContract(
      web3auth,
      marketPlaceContractAddress,
      marketPlaceContractAbi.abi
    );
  };

  const _benefitsContract = (web3auth) => {
    return generateContract(
      web3auth,
      benefitsContractAddress,
      benefitsContractAbi.abi
    );
  };

  const _paymentGatewayContract = (web3auth) => {
    return generateContract(
      web3auth,
      paymenGatewayContractAddress,
      paymentGatewayContractAbi.abi
    );
  };

  return {
    feedContract,
    _cosmoContract,
    _marketPlaceContract,
    _benefitsContract,
    _paymentGatewayContract,
  };
}

async function generateContract(web3auth, address, abi) {
  let biconomy;
  try {
    if (web3auth.provider) {
      biconomy = new Biconomy(web3auth.provider, {
        apiKey: process.env.REACT_APP_BICONOMY_API_KEY_MUMBAI,
        debug: true,
        contractAddresses: [
          feedContractAddress,
          cosmoContractAddress,
          marketPlaceContractAddress,
          benefitsContractAddress,
          paymenGatewayContractAddress,
        ],
      });
      await biconomy.init();
      const contract = new ethers.Contract(
        address,
        abi,
        biconomy.ethersProvider
      );
      return { biconomy, contract };
    }
  } catch (error) {
    biconomy = new Biconomy(window.ethereum, {
      apiKey: process.env.REACT_APP_BICONOMY_API_KEY_MUMBAI,
      debug: true,
      contractAddresses: [
        feedContractAddress,
        cosmoContractAddress,
        marketPlaceContractAddress,
        benefitsContractAddress,
        paymenGatewayContractAddress,
      ],
    });
    const contract = new ethers.Contract(address, abi, biconomy.ethersProvider);
    return { contract };
  }
}
