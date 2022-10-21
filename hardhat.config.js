require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

/**
 @type import('hardhat/config').HardhatUserConfig
**/

module.exports = {
  paths: {
    sources: './src/blockchain/hardhat/contracts',
    tests: './src/blockchain/hardhat/test',
    cache: './src/blockchain/hardhat/cache',
    artifacts: './src/blockchain/hardhat/artifacts'
  },
  etherscan: {
    apiKey: process.env.SNOWTRANCE_API_KEY
  },

  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: 'https://api.avax-test.network/ext/bc/C/rpc',
        blockNumber: 7605882
      }
    },
    localhost: {},
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: '0.8.15'
}