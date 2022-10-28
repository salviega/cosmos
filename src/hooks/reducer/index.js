import { reducerObjectMarketplace } from './reducerObject/reducerObjectMarketplace'
import { reducerObjectFaucet } from './reducerObject/reducerObjectFaucet'

export const reducerMarketPlace = () => {
  const { initialValue, reducerObject, actionMarketplace: actionTypes } = reducerObjectMarketplace()
  return { initialValue, reducerObject, actionTypes }
}

export const reducerFaucet = () => {
  const { initialValue, reducerObject, actionFaucet: actionTypes } = reducerObjectFaucet()
  return { initialValue, reducerObject, actionTypes }
}