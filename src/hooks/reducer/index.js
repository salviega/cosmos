import { reducerObjectMarketplace } from './reducerObject/reducerObjectMarketplace'

export const reducerMarketPlace = () => {
  const { initialValue, reducerObject, actionMarketplace: actionTypes } = reducerObjectMarketplace()
  return { initialValue, reducerObject, actionTypes }
}