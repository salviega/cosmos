import './CosmosGateway.scss'
import { ethers } from 'ethers'
import React, { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, useContracts } from '../../hooks/context'
import { CosmosLoading } from '../../shared/CosmosLoading'

export function CosmosGateway () {
  const auth = useAuth()
  const contracts = useContracts()
  let amount = useRef()
  const email = useRef()
  const [loading, setLoading] = useState(false)

  const onError = (error) => {
    alert('Hubo un error, revisa la consola')
    setLoading(false)
    console.error(error)
  }

  const onRequestPayOut = async (event) => {
    event.preventDefault()
    amount = ethers.utils.parseEther(amount.current.value, 'ether')

    const info = {
      email: email.current.value,
      amount: parseInt(amount) * 10 ** 18
    }

    try {
      setLoading(true)
      const response = await contracts.cosmoContract.authorizeOperator(
        contracts.paymentGatewayContract.address
      )

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 =
            await contracts.paymentGatewayContract.requestPayOut(
              '0x022EEA14A6010167ca026B32576D6686dD7e85d2',
              'd9d827f01e53462b84efbeaab08c7061',
              info.email,
              amount,
              info.amount,
              { gasLimit: 2500000 }
            )
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                alert('Fueron cambiados tus cosmos a dólares')
                setLoading(false)
              }, 3000)
            })
            .catch((error) => {
              onError(error)
            })
        })
        .catch((error) => {
          onError(error)
        })
    } catch (error) {
      onError(error)
    }
  }

  if (auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return (
    <div className='faucet'>
      <p className='faucet__title'>Pasarela de pagos</p>
      <p className='faucet__description'>
        Convierte tus Cosmos en dólares, te llegaran a tu cuenta de Paypal
      </p>
      {loading
        ? (
          <div className='faucet__loading'>
            <CosmosLoading />
          </div>
          )
        : (
          <form className='faucet-form' onSubmit={onRequestPayOut}>
            <span>
              <p className='faucet-form__subtitle'>Correo electrónico</p>

              <input
                className='faucet-form__add'
                ref={email}
                type='email'
                required
              />
            </span>
            <span>
              <p className='faucet-form__subtitle'>Cosmos</p>
              <input className='faucet-form__add' ref={amount} required min='1' />
            </span>
            <div className='faucet-form-container'>
              <button className='faucet-form__submit'>Canjear</button>
            </div>
          </form>
          )}
    </div>
  )
}
