import { ethers } from 'ethers'
import { actionFaucet } from '../actionTypes/actionFaucet'

export function reducerObjectFaucet () {
  const initialValue = {
    amount: ethers.utils.parseEther('10', 'ether'),
    error: false,
    loading: true,
  }

  const reducerMarketplace = (state, action) => {
    switch (action.type) {
      case 'ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false
        }
      case 'LOADING':
        return {
          ...state,
          loading: true
        }
      case 'SUCCESS':
        return {
          ...state,
          error: false,
          loading: false,
        }
      default:
        return {
          ...state
        }
    }
  }

  return { initialValue, reducerMarketplace, actionFaucet }
}
