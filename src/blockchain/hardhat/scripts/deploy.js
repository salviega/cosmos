const fs = require('fs')
const { ethers } = require('hardhat')

async function main () {
  const FeedContract = await ethers.getContractFactory('FeedContract')
  const feedContract = await FeedContract.deploy()
  await feedContract.deployed()
  console.log('FeedContract was deployed to: ' + feedContract.address)
  console.log('FeedContract was deployein to block number: ' + await feedContract.provider.getBlockNumber())

  const CosmoContract = await ethers.getContractFactory('CosmoContract')
  const cosmoContract = await CosmoContract.deploy()
  await cosmoContract.deployed()
  console.log('CosmoContract was deployed to: ' + cosmoContract.address)
  console.log('CosmoContract was deployein to block number: ' + await cosmoContract.provider.getBlockNumber())

  const MarketPlaceContract = await ethers.getContractFactory('MarketPlaceContract')
  const marketPlaceContract = await MarketPlaceContract.deploy(cosmoContract.address)
  await marketPlaceContract.deployed()
  console.log('MarketPlaceContract was deployed to: ' + marketPlaceContract.address)
  console.log('MarketPlaceContract was deployein to block number: ' + await marketPlaceContract.provider.getBlockNumber())

  await cosmoContract.authorizeOperator(marketPlaceContract.address)

  const BenefitsContract = await ethers.getContractFactory('BenefitsContract')
  const benefitsContract = await BenefitsContract.deploy()
  await benefitsContract.deployed()
  console.log('BenefitsContract was deployed to: ' + marketPlaceContract.address)
  console.log('BenefitsContract was deployein to block number: ' + await marketPlaceContract.provider.getBlockNumber())

  await cosmoContract.authorizeOperator(BenefitsContract.address)

  const PaymentGatewayContract = await ethers.getContractFactory('PaymentGatewayContract')
  const paymentgatewaycontract = await PaymentGatewayContract.deploy('0x51d956586AaCDdA6292f89eEDE0aEbB1a8bAf6e3')
  await paymentgatewaycontract.deployed()

  console.log('PaymentGatewayContract was deployed to: ' + paymentgatewaycontract.address)
  console.log('PaymentGatewayContract was deployein to block number: ' + await paymentgatewaycontract.provider.getBlockNumber())

  const addresses = [
    {
      feedcontract: feedContract.address,
      blocknumber: await feedContract.provider.getBlockNumber()
    },
    {
      cosmocontract: cosmoContract.address,
      blocknumber: await cosmoContract.provider.getBlockNumber()
    },
    {
      marketplacecontract: marketPlaceContract.address,
      blocknumber: await marketPlaceContract.provider.getBlockNumber()
    },
    {
      benefitscontract: benefitsContract.address,
      blocknumber: await benefitsContract.provider.getBlockNumber()
    },
    {
      paymentgatewaycontract: paymentgatewaycontract.address,
      blocknumber: await paymentgatewaycontract.provider.getBlockNumber()
    }
  ]
  const addressesJSON = JSON.stringify(addresses)
  fs.writeFileSync('src/blockchain/hardhat/environment/contract-address_2".json', addressesJSON)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
