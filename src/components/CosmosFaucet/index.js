import './CosmosFaucet.scss'
import React from 'react'
import { ethers } from 'ethers'
import logo from '../../asserts/images/logo-cosmos.png'
import { useAuth, useContracts } from '../CosmosContext'
import { Navigate } from 'react-router-dom'

export function CosmosFaucet (props) {
  const auth = useAuth()
  const contracts = useContracts()
  const address = React.useRef()
  const amount = ethers.utils.parseEther('10', 'ether')

  const mintCosmo = async (event) => {
    event.preventDefault()
    const info = {
      address: address.current.value,
      amount
    }

    await contracts.cosmoContract.safeMint(info.address, info.amount)
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
      <form className='faucet-form' onSubmit={mintCosmo}>
        <span>
          <p className='faucet-form__subtitle'>Dirección de billetera</p>
          <input className='faucet-form__add' ref={address} />
        </span>
        <div className='faucet-form-container'>
          <figure>
            <img src={logo} alt='logo' />
          </figure>
          <button className='faucet-form__submit'>Redime 10 CMS</button>
        </div>
      </form>
    </div>
  )
}
