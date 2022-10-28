import './CosmosFaucet.scss'
import React from 'react'
import { ethers } from 'ethers'
import logo from '../../asserts/images/logo-cosmos.png'
import { useAuth, useContracts } from '../CosmosContext'
import { Navigate } from 'react-router-dom'
import { CosmosLoading } from '../../shared/CosmosLoading'

export function CosmosFaucet (props) {
  const auth = useAuth()
  const contracts = useContracts()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const address = React.useRef()
  const amount = ethers.utils.parseEther('10', 'ether')

  const mintCosmo = async (event) => {
    event.preventDefault()
    const info = {
      address: address.current.value,
      amount
    }
    setLoading(true)

    try {
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.marketPlaceContract.address
      )
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.cosmoContract.safeMint(
            info.address,
            info.amount
          )
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                alert('Fueron añadidos 10 cosmos a su billetera')
                setLoading(false)
              }, 3000)
            })
            .catch((error) => {
              console.log(error)
              setLoading(false)
              setError(true)
            })
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          setError(true)
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(true)
    }
  }

  if (auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return (
    <div className='faucet'>
      <p className='faucet__title'>Faucet</p>
      <p className='faucet__description'>
        Retira todos los Cosmos que quieras.
      </p>
      {error && 'Hubo un error... mira la consola'}
      {loading && !error && (
        <div className='faucet__loading'>
          <CosmosLoading />
        </div>
      )}
      {!loading && !error && (
        <form className='faucet-form' onSubmit={mintCosmo}>
          <span>
            <p className='faucet-form__subtitle'>Dirección de billetera</p>
            <input
              className='faucet-form__add'
              ref={address}
              type='text'
              required
            />
          </span>
          <div className='faucet-form-container'>
            <figure>
              <img src={logo} alt='logo' />
            </figure>
            <button className='faucet-form__submit'>Redime 10 CMS</button>
          </div>
        </form>
      )}
    </div>
  )
}
