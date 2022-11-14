import './CosmosMaker.scss'
import defaultImage from '../../assets/images/default-image.jpg'
import { ethers } from 'ethers'
import React, { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { v1 as uuid } from 'uuid'
import { useAuth, useContracts } from '../../hooks/context'
import jsonBenefitContract from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json'
import addresses from '../../blockchain/environment/contract-address.json'
import { CosmosLoading } from '../../shared/CosmosLoading'
import { web3Storage } from '../../middleware/web3Storage'
const cosmoContractAddress = addresses[1].cosmocontract

export function CosmosMaker ({ createItem, setSincronizedItems }) {
  const auth = useAuth()
  const contracts = useContracts()
  const navigate = useNavigate()
  const description = useRef()
  const managerAddress = useRef()
  const maxNft = useRef()
  const name = useRef()
  const price = useRef()
  const symbol = useRef()
  const terms = useRef()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState('')
  const [typeImage, setTypeImage] = useState('')
  const { putImage, putMetadata } = web3Storage()

  const onError = (error) => {
    alert('Hubo un error, revisa la consola')
    setLoading(false)
    console.error(error)
  }

  const handleImage = (event) => {
    const files = event.target.files
    const file = files[0]
    setImage(file)
    let typefile = file.type
    typefile = typefile.split('/')
    setTypeImage(typefile[1])
    getBase64(file, setImageBase64)
  }

  const onCreateBenefit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const benefitId = uuid()
    const info = {
      benefitId,
      maxNft: maxNft.current.value,
      managerAddress: managerAddress.current.value,
      price: price.current.value,
      cosmoContractAddress,
      name: name.current.value,
      symbol: symbol.current.value,
      traitType: 'Términos y Condiciones:',
      terms: terms.current.value,
      image,
      imageBase64,
      typeImage,
      owner: auth.user.walletAddress,
      description: description.current.value
    }

    const imageHash = await putImage(info)
    const newInfo = { ...info, imageHash }
    const uri = await putMetadata(newInfo)

    try {
      const benefitContractFactory = new ethers.ContractFactory(
        jsonBenefitContract.abi,
        jsonBenefitContract.bytecode,
        contracts.web3Signer
      )
      const benefitContract = await benefitContractFactory.deploy(
        info.managerAddress,
        info.maxNft,
        uri.toString(),
        info.price,
        info.cosmoContractAddress,
        info.name,
        info.symbol
      )
      await benefitContract.deployed()

      const response = await contracts.benefitsContract.createBenefit(
        info.benefitId,
        benefitContract.address
      )
      console.log('created benefit ', benefitContract.address)
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          setTimeout(async () => {
            delete info.image
            await createItem(info)
            alert('El beneficio fue creado')
            setLoading(false)
            setSincronizedItems(false)
            navigate('/')
          }, 3000)
        })
        .catch((error) => {
          onError(error)
        })
    } catch (error) {
      onError()
    }
  }

  if (auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return (
    <div className='maker'>
      <h1 className='maker__title'>Sé parte de nuestro Cosmos</h1>
      {loading
        ? (
          <div className='faucet__loading'>
            <CosmosLoading />
          </div>
          )
        : (
          <form className='maker-form' onSubmit={onCreateBenefit}>
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
            <span>
              <p className='maker-form__subtitle'>Términos y condiciones</p>
              <input className='maker-form__add' ref={terms} />
            </span>
            <button className='maker-form__submit'>Enviar</button>
          </form>
          )}
    </div>
  )
}

function getBase64 (file, state) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    state(reader.result)
  }
}
