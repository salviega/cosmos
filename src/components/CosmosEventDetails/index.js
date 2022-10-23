import React from 'react';
import './CosmosEventDetails.scss'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ethers } from 'ethers';
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json"
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json"
import cosmoContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json"
import addresses from "../../blockchain/environment/contract-address.json";
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;
const benefitsContractAddress = addresses[3].benefitscontract;

export function CosmosEventDetails({ getItem }) {
  const [item, setItem] = React.useState({})
  const [contract, setContract] = React.useState({})
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const auth = useAuth();
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

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


  const mintBenefit = async () => {

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();

    const cosmoContract = new ethers.Contract(
      cosmoContractAddress,
      cosmoContractAbi.abi,
      web3Signer
    );

    const response = await cosmoContract.safeMint(auth.user.walletAddress, "3000000000000000000")
    web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        const response2 = cosmoContract.authorizeOperator(contract.address)
        web3Provider
          .waitForTransaction(response2.hash)
          .then(async (_response2) => {
            await contract.safeMint(cosmoContractAddress, { gasLimit: 2500000, })
          })
          .catch(async (error) => {
            console.error(error)
            await contract.safeMint(cosmoContractAddress, { gasLimit: 2500000, })
          })
      })
  }

  React.useEffect(() => {
    if (location.state?.event) {
      setItem(location.state?.event)
      getBenefit(location.state?.event.benefitId)


    } else {
      data(slug)
      getBenefit(slug)
    }
  }, [])

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to='/' />
  }

  if (!item) {
    return <></>
  }

  return (

    <div className="details">
      <img src={item.imageBase64} alt='logo'></img>
      <div className='details__info'>
        <h1>{item.name}</h1>
        <h2>{parseInt(item.price) / Math.pow(10, 18)}</h2>
        <p>{item.description}</p>
      </div>
      <div className='details-buttons'>
          <button className="details-buttons__volver" onClick={() => navigate("/")}>Volver</button>
          <button className="details-buttons__redimir" onClick={mintBenefit} >Redimir</button>
        </div>
    </div>
  )
}