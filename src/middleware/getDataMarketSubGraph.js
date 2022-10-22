import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export function getDataMarketSubGraph () {
  const url = 'https://api.studio.thegraph.com/query/32331/colombian-dao-market-v2/v0.0.1'

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
