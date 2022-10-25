import feedContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json'
import cosmoContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json'
import marketPlaceContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketPlaceContract.json'
import benefitsContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json'
import addresses from '../../blockchain/environment/contract-address.json'
import { ethers } from 'ethers'
const feedContractAddress = addresses[0].feedcontract
const cosmoContractAddress = addresses[1].cosmocontract
const marketPlaceContractAddress = addresses[2].marketplacecontract
const benefitsContractAddress = addresses[3].benefitscontract

export function useContractContext (signer) {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/avalanche_fuji'
  )

  const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
  const web3Signer = web3Provider.getSigner()

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  )
  const cosmoContract = generateContract(
    cosmoContractAddress,
    cosmoContractAbi.abi,
    web3Signer
  )
  const marketPlaceContract = generateContract(
    marketPlaceContractAddress,
    marketPlaceContractAbi.abi,
    web3Signer
  )
  const benefitsContract = generateContract(
    benefitsContractAddress,
    benefitsContractAbi.abi,
    web3Signer
  )

  return { web3Provider, web3Signer, feedContract, cosmoContract, marketPlaceContract, benefitsContract }
}

function generateContract (address, abi, provider) {
  const contract = new ethers.Contract(address, abi, provider)
  return contract
}
