import React from 'react';
import './CosmosEventDetails.scss'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ethers } from 'ethers';
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json"
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json"
import addresses from "../../blockchain/environment/contract-address.json";
const benefitsContractAddress = addresses[3].benefitscontract;

export function CosmosEventDetails({ getItem }) {
  const [item, setItem] = React.useState({})
  const [contract, setContract] = React.useState({})
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const auth = useAuth();
  const location = useLocation();
  const { slug } = useParams();

  const data = async (id) => {
    try {
      setItem(await getItem(id))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error(error)
    }
  }

  const getBenefit = async (id) => {

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();

    const benefitsContract = new ethers.Contract(
      benefitsContractAddress,
      benefitsContractAbi.abi,
      web3Provider
    );

    const benefitContractAddress = await benefitsContract.getBenefit(id)
    const benefitContract = new ethers.Contract(
      benefitContractAddress,
      benefitContractAbi.abi,
      web3Signer
    )
    setContract(benefitContract)
  }


  const mintBenefit = () => {
    console.log(contract)
  }

  React.useEffect(() => {
    if (location.state?.event) {
      setItem(location.state?.event)

      

      getBenefit(location.state?.event.benefitId)
    } else {
      data(slug)
      getBenefit(slug)
    }
  },[])

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to='/'/>
  }

  if(!item) {
    return <></>
  }

  return (
    <div className="details">
      <img src={item.imageBase64} alt='logo'></img>
      <div className="details__info">
        <h1>{item.name}</h1>
        <h2>{parseInt(item.price)/Math.pow(10,18)}</h2>
        <p>{item.description}</p>
      </div>
      <div className="details__buttons">
       <button className="details__buttons__volver">Volver</button>
        <button onClick={mintBenefit} className="details__buttons__redimir">Redimir</button>
      </div>
    </div>
  )
}