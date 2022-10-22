import { v1 as uuid } from 'uuid'
const fs = require('fs')  
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('yourPinataApiKey', 'yourPinataSecretApiKey');

export function pinataApiRest() {
  
  const createNftMetadata = async (metadata) => {
    try {
      const uri = metadata.image
      const hashImagen = await pinata.hashMetadata(uuid(), uri)
      const preparedMetadata = {
        "description": metadata.description, 
        "external_url": metadata.external_url, 
        "image": hashImagen, 
        "name": metadata.name,
        "attributes": [
          {
            "trait_type": "Terms and conditions", 
            "value": metadata.termAndConditions
          }, 
        ] 
      }
      return await pinata.hashMetadata(metadata.uri, preparedMetadata)

    } catch(error) {
      console.log(error)
      return error
    }
  }

  return { createNftMetadata }
}
