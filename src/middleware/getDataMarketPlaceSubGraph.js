import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export function getDataMarketPlaceSubGraph () {
  const url = 'https://api.thegraph.com/subgraphs/name/salviega/cosmos'

  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache()
  })

  const queryItemsForSale = `
    query {
      dataOfferds {
        id
        itemId
        nft
        tokenId
        tokenURI
        artist
        taxFee
        addressTaxFeeToken
        price
        seller
      }
    }
  `
  const queryPurchasedItems = `
    query {
      dataBoughts {
        id
        itemId
        nft
        tokenId
        tokenURI
        artist
        taxFee
        addressTaxFeeToken
        price
        buyer
      }
    }
  `
  const getItemsForSale = async () => {
    const response = await client.query({ query: gql(queryItemsForSale) })
    return response.data.dataOfferds
  }

  const getPurchasedItems = async () => {
    const response = await client.query({ query: gql(queryPurchasedItems) })
    return response.data.dataBoughts
  }

  return {
    getItemsForSale,
    getPurchasedItems
  }
}