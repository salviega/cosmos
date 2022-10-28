import React from 'react'
import defaultImage from '../../asserts/images/default-image.jpg'
import './CosmosMaker.scss'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth, useContracts } from '../../hooks/context'
import addresses from '../../blockchain/environment/contract-address.json'
import { v1 as uuid } from 'uuid'
import jsonBenefitContract from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json'
import { ethers } from 'ethers'
const cosmoContractAddress = addresses[1].cosmocontract

export function CosmosMaker ({ createItem, setSincronizedItems }) {
  const auth = useAuth()
  const contracts = useContracts()
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
    event.preventDefault()
    const benefitId = uuid()
    let info = {
      benefitId,
      maxNft: maxNft.current.value,
      managerAddress: managerAddress.current.value,
      uri: uri.current.value,
      price: price.current.value,
      cosmoContractAddress,
      name: name.current.value,
      symbol: symbol.current.value,
      imageBase64,
      owner: auth.user.walletAddress,
      description: description.current.value
    }

    const benefitContractFactory = new ethers.ContractFactory(
      jsonBenefitContract.abi,
      jsonBenefitContract.bytecode,
      contracts.web3Signer
    )
    const benefitContract = await benefitContractFactory.deploy(
      info.managerAddress,
      info.maxNft,
      info.uri,
      info.price,
      info.cosmoContractAddress,
      info.name,
      info.symbol
    )
    await benefitContract.deployed()
    await contracts.benefitsContract.createBenefit(
      info.benefitId,
      benefitContract.address
    )

    info = { ...info, benefitContractAddress: benefitContract.address }
    console.log(info)

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
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageBase64(reader.result)
    }
  }

  if (auth.user.walletAddress === 'Connect your wallet') {
    return <Navigate to='/' />
  }
  return (
    <div className='maker'>
      <h1 className='maker__title'>Sé parte de nuestro Cosmos</h1>
      <form className='maker-form' onSubmit={createBenefit}>
        <p className='maker-form__description'>
          Comparte tus datos para convertirte en un comercio aliado de Cosmos
          BBVA. Nuestro equipo se encargará de crear un NFT personalizado para
          tu beneficio.
        </p>
        <div className='maker-form-image'>
          <figure>
            <img
              src={imageBase64 === '' ? defaultImage : imageBase64}
              alt='default'
            />
            <figcaption>
              <input
                className='maker-form-image__upgrade'
                type='file'
                accept='image/x-png,image/gif,image/jpeg'
                onChange={handleImage}
              />
            </figcaption>
          </figure>
        </div>
        <span>
          <p className='maker-form__subtitle'>Número máximo de NFTs</p>
          <input className='maker-form__add' ref={maxNft} />
        </span>
        <span>
          <p className='maker-form__subtitle'>
            Wallet del manager del proyecto
          </p>
          <input className='maker-form__add' ref={managerAddress} />
        </span>
        <span>
          <p className='maker-form__subtitle'>URI</p>
          <input className='maker-form__add' ref={uri} />
        </span>
        <span>
          <p className='maker-form__subtitle'>Precio</p>
          <input className='maker-form__add' ref={price} />
        </span>
        <span>
          <p className='maker-form__subtitle'>Nombre</p>
          <input className='maker-form__add' ref={name} />
        </span>
        <span>
          <p className='maker-form__subtitle'>Símbolo</p>
          <input className='maker-form__add' ref={symbol} />
        </span>
        <span>
          <p className='maker-form__subtitle'>Descripción del beneficio</p>
          <input className='maker-form__add' ref={description} />
        </span>
        <button className='maker-form__submit'>Enviar</button>
      </form>
    </div>
  )
}
