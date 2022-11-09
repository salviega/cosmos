import feedContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json";
import cosmoContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketPlaceContract.json";
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json";
import paymentGatewayContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/PaymentGatewayContract.sol/PaymentGatewayContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
import { ethers } from "ethers";
const feedContractAddress = addresses[0].feedcontract;
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;
const benefitsContractAddress = addresses[3].benefitscontract;
const paymenGatewayContractAddress = addresses[4].paymentgatewaycontract;

export function useContractContext(web3authProvider) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/avalanche_fuji"
  );

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  );

  const _cosmoContract = (web3Signer) => {
    console.log(web3Signer?.address);
    return generateContract(
      cosmoContractAddress,
      cosmoContractAbi.abi,
      web3Signer
    );
  };

  const _marketPlaceContract = (web3Signer) => {
    return generateContract(
      marketPlaceContractAddress,
      marketPlaceContractAbi.abi,
      web3Signer
    );
  };

  const _benefitsContract = (web3Signer) => {
    return generateContract(
      benefitsContractAddress,
      benefitsContractAbi.abi,
      web3Signer
    );
  };

  const _paymentGatewayContract = (web3Signer) => {
    return generateContract(
      paymenGatewayContractAddress,
      paymentGatewayContractAbi.abi,
      web3Signer
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

function generateContract(address, abi, provider) {
  const contract = new ethers.Contract(address, abi, provider);
  return contract;
}
