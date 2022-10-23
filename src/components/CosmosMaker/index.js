import React from 'react';
import defaultImage from '../../asserts/images/default-image.jpg'
import './CosmosMaker.scss'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import addresses from "../../blockchain/environment/contract-address.json";
import { v1 as uuid } from 'uuid' 
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json";
import { ethers } from 'ethers';
const cosmoContractAddress = addresses[1].cosmocontract;
const benefitsContractAddress = addresses[3].benefitscontract;


export function CosmosMaker({createItem, setSincronizedItems }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [imageBase64, setImageBase64] = React.useState('')
  const maxNft = React.useRef()
  const managerAddress = React.useRef()
  const uri = React.useRef()
  const price = React.useRef()
  const name = React.useRef()
  const symbol = React.useRef()
  const description = React.useRef()
  
  const createBenefit = async (event) => {
    event.preventDefault();
    const benefitId = uuid()
    const info = {
      benefitId: benefitId,
      maxNft: maxNft.current.value,
      managerAddress: managerAddress.current.value,
      uri: uri.current.value,
      price: price.current.value,
      cosmoContractAddress: cosmoContractAddress,
      name: name.current.value, 
      symbol: symbol.current.value,
      imageBase64: imageBase64,
      owner: auth.user.walletAddress, 
      description: description.current.value
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();

    const benefitsContract = new ethers.Contract(
      benefitsContractAddress,
      benefitsContractAbi.abi,
      web3Signer
    );

    await benefitsContract.createBenefit(info.benefitId, info.maxNft, info.managerAddress, info.uri, info.price, info.cosmoContractAddress, info.name, info.symbol)

    await createItem(info)
    setSincronizedItems(false)
    alert('Event created')
    navigate('/')
  }

  const handleImage = (event) => {
    const files = event.target.files
    const file = files[0]
    getBase64(file)
  }

  const getBase64 = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageBase64(reader.result)
    }
  }
  
  if(auth.user.walletAddress === "Connect your wallet") {
    return <Navigate to='/'/>
  }
  return (
    <div className="maker">
    <h1 className="maker__title">Create new event</h1>
    <form className="maker-form" onSubmit={createBenefit}>
      <p className="maker-form__description">Click on the pictue to upgrade the image</p>
      <div className='maker-form-image'>
          <figure>
            <img src={imageBase64 === '' ? defaultImage : imageBase64 } alt="default" />
            <figcaption>
              <input className='maker-form-image__upgrade' type='file' accept='image/x-png,image/gif,image/jpeg' onChange={handleImage}/>
            </figcaption>
          </figure>
      </div>  
      <span>
        <p className="maker-form__subtitle">maxNft</p>
        <input className="maker-form__add" ref={maxNft}/>
      </span>
      <span>
        <p className="maker-form__subtitle">managerAddress</p>
        <input className="maker-form__add" ref={managerAddress}/>
      </span>
      <span>
        <p className="maker-form__subtitle">uri</p>
        <input className="maker-form__add" ref={uri}/>
      </span>
      <span>
        <p className="maker-form__subtitle">price</p>
        <input className="maker-form__add" ref={price}/>
      </span>
      <span>
        <p className="maker-form__subtitle">name</p>
        <input className="maker-form__add" ref={name}/>
      </span>
      <span>
        <p className="maker-form__subtitle">symbol</p>
        <input className="maker-form__add" ref={symbol}/>
      </span>
      <span>
        <p className="maker-form__subtitle">description</p>
        <input className="maker-form__add" ref={description}/>
      </span>
      <button className="maker-form__submit">Create</button>
    </form>
</ div>
  )
}