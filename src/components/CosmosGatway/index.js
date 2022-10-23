import './CosmosGateway.scss'
import React from 'react'
import { ethers } from 'ethers'
import paymentGatewayContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/PaymentGatewayContract.sol/PaymentGatewayContract.json'
import addresses from '../../blockchain/environment/contract-address.json'
import cosmoContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json'
const cosmoContractAddress = addresses[1].cosmocontract

const paymentGatewayContractAddress = addresses[4].paymentgatewaycontract

export function CosmosGateway () {
  const email = React.useRef()
  const amount = React.useRef()

  const changeCurrency = async (event) => {
    event.preventDefault()
    const info = {
      email: email.current.value,
      amount: amount.current.value
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    const web3Signer = web3Provider.getSigner()

    const paymentGatewayContractContract = new ethers.Contract(
      paymentGatewayContractAddress,
      paymentGatewayContractAbi.abi,
      web3Signer
    )

    const cosmoContract = new ethers.Contract(
      cosmoContractAddress,
      cosmoContractAbi.abi,
      web3Signer
    )

    const response = await cosmoContract.authorizeOperator(paymentGatewayContractAddress)

    web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        await paymentGatewayContractContract.requestPayOut('0x022EEA14A6010167ca026B32576D6686dD7e85d2', '2ba195e0ecc34e41bc20ab8c80d7e162', info.email, parseInt(info.amount), info.amount, { gasLimit: 2500000 })
      })
      .catch(async (error) => {
        console.error(error)
        await paymentGatewayContractContract.requestPayOut('0x022EEA14A6010167ca026B32576D6686dD7e85d2', '2ba195e0ecc34e41bc20ab8c80d7e162', info.email, parseInt(info.amount), info.amount, { gasLimit: 2500000 })
      })
  }

  return (
    <div className='faucet'>
      <p className='faucet__title'>Pasarela de pagos</p>
      <p className='faucet__description'>
        Convierte tus Cosmos en dólares, te llegaran a tu cuenta de Paypal
      </p>
      <form onSubmit={changeCurrency}>
        <div className='faucet-menu-search'>
          <input
            className='menu-left-search__bar'
            placeholder='email'
            ref={email}
          />
        </div>
        <div className='faucet-menu-search'>
          <input
            className='menu-left-search__bar'
            placeholder='Cosmos BBVA'
            ref={amount}
          />
        </div>
        <button>Canjear</button>
      </form>
    </div>
  )
}
