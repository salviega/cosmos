const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MarketContract testing', async () => {
  let admin, artist, owner1, owner2
  const taxFee = ethers.utils.parseUnits('1', 'ether')
  let cosmoContract, marketPlaceContract

  beforeEach(async () => {
    [admin, artist, owner1, owner2] = await ethers.getSigners()

    const CosmoContract = await ethers.getContractFactory('CosmoContract')
    cosmoContract = await CosmoContract.deploy()
    await cosmoContract.deployed()

    const MarketPlaceContract = await ethers.getContractFactory('MarketPlaceContract')
    marketPlaceContract = await MarketPlaceContract.deploy(cosmoContract.address)
    await marketPlaceContract.deployed()

    await cosmoContract.authorizeOperator(marketPlaceContract.address)
    await cosmoContract.connect(owner1).buyTokens(ethers.utils.parseUnits('3', 'ether'), { value: ethers.utils.parseUnits('3', 'ether') })
  })

  it("Should transfer Marketplace's NFT and pay royalties", async () => {
    let ownerNFT, offerdItem, balanceCustomer, balanceArtist

    marketPlaceContract = marketPlaceContract.connect(admin)
    await marketPlaceContract.mint('UNO', artist.address, taxFee, cosmoContract.address)
    ownerNFT = await marketPlaceContract.ownerOf(0)

    expect(ownerNFT).to.equal(admin.address)

    await marketPlaceContract.approve(marketPlaceContract.address, 0)
    await marketPlaceContract.sellItem(marketPlaceContract.address, 0, ethers.utils.parseUnits('1', 'ether'))
    offerdItem = await marketPlaceContract.items(1)

    expect(offerdItem[5]).to.equal(artist.address)

    await marketPlaceContract.addContractToken(cosmoContract.address)
    await cosmoContract.connect(owner1).authorizeOperator(marketPlaceContract.address)

    marketPlaceContract = marketPlaceContract.connect(owner1)
    await marketPlaceContract.buyItem(cosmoContract.address, 1, { value: ethers.utils.parseUnits('1', 'ether') })
    ownerNFT = await marketPlaceContract.ownerOf(0)

    expect(ownerNFT).to.equal(owner1.address)

    await marketPlaceContract.connect(owner1).transferFrom(owner1.address, owner2.address, 0)
    ownerNFT = await marketPlaceContract.ownerOf(0)

    expect(ownerNFT).to.equal(owner2.address)

    balanceCustomer = await cosmoContract.balanceOf(owner1.address)
    balanceArtist = await cosmoContract.balanceOf(artist.address)
    expect(balanceCustomer.toString()).to.equal(ethers.utils.parseUnits('1', 'ether'))
    expect(balanceArtist.toString()).to.equal(ethers.utils.parseUnits('1', 'ether'))
  })
})

// describe('MarketContract testing', async () =>  {
//   let admin, owner1, owner2;
//   let cosmoContract, marketPlaceContract;

//   beforeEach(async() => {
//     [admin, owner1, owner2] = await ethers.getSigners();

//     const CosmoContract = await ethers.getContractFactory('CosmoContract')
//     cosmoContract = await CosmoContract.deploy()
//     await cosmoContract.deployed()

//     const MarketPlaceContract = await ethers.getContractFactory('MarketPlaceContract')
//     marketPlaceContract = await MarketPlaceContract.deploy(cosmoContract.address)
//     await marketPlaceContract.deployed()

//     await cosmoContract.authorizeOperator(marketPlaceContract.address)
//     await cosmoContract.safeMint(admin.address, ethers.utils.parseUnits('3', 'ether'))
//     await cosmoContract.safeMint(owner1.address, ethers.utils.parseUnits('3', 'ether'))
//   })

//   it("Should transfer Marketplace's NFT", async () => {
//     let ownerNFT, item;

//     marketPlaceContract = marketPlaceContract.connect(admin)
//     await marketPlaceContract.mint("UNO")
//     ownerNFT = await marketPlaceContract.ownerOf(0)

//     expect(ownerNFT).to.equal(admin.address);

//     await marketPlaceContract.approve(marketPlaceContract.address, 0)
//     await marketPlaceContract.sellItem(marketPlaceContract.address, 0, ethers.utils.parseUnits('1', 'ether'))
//     item = await marketPlaceContract.items(1)

//     expect(item[5]).to.equal(false)

//     await marketPlaceContract.addContractToken(cosmoContract.address)
//     await cosmoContract.connect(owner1).authorizeOperator(marketPlaceContract.address)
//     marketPlaceContract = marketPlaceContract.connect(owner1)
//     await marketPlaceContract.buyItem(cosmoContract.address, 1, {value: ethers.utils.parseUnits('1', 'ether')})
//     ownerNFT = await marketPlaceContract.ownerOf(0)

//     expect(ownerNFT).to.equal(owner1.address);

//     await marketPlaceContract.connect(owner1).transferFrom(owner1.address, owner2.address, 0);
//     ownerNFT = await marketPlaceContract.ownerOf(0)

//     expect(ownerNFT).to.equal(owner2.address);
//   })
// })
