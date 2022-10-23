import './CosmosFaucet.scss'
import React, { useRef } from 'react'
import { ethers } from 'ethers'
import logo from '../../asserts/images/logo-cosmos.png'
import addresses from '../../blockchain/environment/contract-address.json'
import cosmoContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json'
const cosmoContractAddress = addresses[1].cosmocontract

export function CosmosFaucet () {
  const address = React.useRef()
  const amount = React.useRef()

  const mintCosmo = async (event) => {
    event.preventDefault()
    const info = {
      address: address.current.value,
      amount: amount.current.value
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    const web3Signer = web3Provider.getSigner()

    const cosmoContract = new ethers.Contract(
      cosmoContractAddress,
      cosmoContractAbi.abi,
      web3Signer
    )

    await cosmoContract.safeMint(info.address, info.amount)
  }
  return (
    <div className='faucet'>
      <p className='faucet__title'>Faucet</p>
      <p className='faucet__description'>
        Retira todos los Cosmos que quieras.
      </p>
      <form className='faucet-form' onSubmit={mintCosmo}>
        <div className='faucet-menu-search'>
          <input className='menu-left-search__bar' placeholder='Dirección hexadecimal (0x...)' ref={address} />
        </div>
        <div className='faucet-menu-search'>
          <figure>
            <img src={logo} alt='logo' />
          </figure>
          <input className='menu-left-search__bar' placeholder='WEI' ref={amount} />
        </div>
        <button className='maker-form__submit'>Mintear</button>
      </form>
    </div>
  )
}
