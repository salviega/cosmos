import React from 'react';
// import teams from "../../asserts/json/harcoredData.json";
import './CosmosEventDetails.scss'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ethers } from 'ethers';
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json"
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json"
import addresses from "../../blockchain/environment/contract-address.json";
const benefitsContractAddress = addresses[3].benefitscontract;

export async function CosmosEventDetails({ getItem }) {
  const [item, setItem] = React.useState()
  const [contract, setContract] = React.useState()
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const auth = useAuth();
  const location = useLocation();
  const { slug } = useParams();

  const data = async (id) => {
    try {
      setItem(await getItem(id))
      setContract(await findBenefitById(id))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error(error)
    }
  }

  const findBenefitById = async (id) => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();
  
    const benefitsContract = new ethers.Contract(
      benefitsContractAddress,
      benefitsContractAbi.abi,
      web3Provider
    );
  
    const benefitContractAddress = await benefitsContract.getBenefit(item.benefitId)
  
    const provider = ethers.providers.getDefaultProvider('fuji')
    return new ethers.Contract(benefitContractAddress, benefitContractAbi.abi, provider)

  }

  const mint = async () => {
    
  }


  React.useState(() => {
    if (location.state?.event) {
      setItem(location.state?.event)
      findBenefitById(item.state?.id)
    } else {
      data(slug)
    }
  })

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to='/'/>
  }

  if(!item) {
    return <></>
  }

  return (
    <div>
      <h1>Titulo: {item.name}</h1>
      <img src={item.imageBase64} alt='image'/>
      <h1>descripcion: {item.description}</h1>
      <h1>precio: {parseInt(item.price)/Math.pow(10,18)}</h1>
      <button>atras</button>
      <button onClick={mint}>Redimir</button>
    </div>
  )
}