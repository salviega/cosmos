const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const FeedContract = await ethers.getContractFactory("FeedContract");
  const feedContract = await FeedContract.deploy();
  await feedContract.deployed();
  console.log("FeedContract was deployed to: " + feedContract.address);
  console.log(
    "FeedContract was deployein to block number: " +
      (await feedContract.provider.getBlockNumber())
  );

  const CosmoContract = await ethers.getContractFactory("CosmoGaslessContract");
  const cosmoContract = await CosmoContract.deploy(
    "0x70A792ad975Aa0977c6E9d55a14f5F2228bBC685"
  );
  await cosmoContract.deployed();
  console.log("CosmoContract was deployed to: " + cosmoContract.address);
  console.log(
    "CosmoContract was deployein to block number: " +
      (await cosmoContract.provider.getBlockNumber())
  );

  const MarketPlaceContract = await ethers.getContractFactory(
    "MarketPlaceGaslessContract"
  );
  const marketPlaceContract = await MarketPlaceContract.deploy(
    "0x70A792ad975Aa0977c6E9d55a14f5F2228bBC685",
    cosmoContract.address
  );
  await marketPlaceContract.deployed();
  console.log(
    "MarketPlaceContract was deployed to: " + marketPlaceContract.address
  );
  console.log(
    "MarketPlaceContract was deployein to block number: " +
      (await marketPlaceContract.provider.getBlockNumber())
  );

  await cosmoContract.authorizeOperator(marketPlaceContract.address);

  const BenefitsContract = await ethers.getContractFactory(
    "BenefitsGaslessContract"
  );
  const benefitsContract = await BenefitsContract.deploy(
    "0x70A792ad975Aa0977c6E9d55a14f5F2228bBC685"
  );
  await benefitsContract.deployed();
  console.log("BenefitsContract was deployed to: " + benefitsContract.address);
  console.log(
    "BenefitsContract was deployein to block number: " +
      (await benefitsContract.provider.getBlockNumber())
  );

  await cosmoContract.authorizeOperator(benefitsContract.address);

  const PaymentGatewayContract = await ethers.getContractFactory(
    "PaymentGatewayGaslessContract"
  );
  const paymentgatewaycontract = await PaymentGatewayContract.deploy(
    "0x70A792ad975Aa0977c6E9d55a14f5F2228bBC685",
    "0x51d956586AaCDdA6292f89eEDE0aEbB1a8bAf6e3"
  );
  await paymentgatewaycontract.deployed();

  console.log(
    "PaymentGatewayContract was deployed to: " + paymentgatewaycontract.address
  );
  console.log(
    "PaymentGatewayContract was deployein to block number: " +
      (await paymentgatewaycontract.provider.getBlockNumber())
  );

  const addresses = [
    {
      feedcontract: feedContract.address,
      blocknumber: await feedContract.provider.getBlockNumber(),
    },
    {
      cosmocontract: cosmoContract.address,
      blocknumber: await cosmoContract.provider.getBlockNumber(),
    },
    {
      marketplacecontract: marketPlaceContract.address,
      blocknumber: await marketPlaceContract.provider.getBlockNumber(),
    },
    {
      benefitscontract: benefitsContract.address,
      blocknumber: await benefitsContract.provider.getBlockNumber(),
    },
    {
      paymentgatewaycontract: paymentgatewaycontract.address,
      blocknumber: await paymentgatewaycontract.provider.getBlockNumber(),
    },
  ];
  const addressesJSON = JSON.stringify(addresses);
  fs.writeFileSync(
    "src/blockchain/environment/contract-address.json",
    addressesJSON
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
