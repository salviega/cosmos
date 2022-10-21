const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MarketContract testing', async () =>  {
  let admin, artist, owner1, owner2;
  const taxFee = ethers.utils.parseUnits('0.001', 'ether');
  let cosmoContract, marketPlaceContract;

  beforeEach(async() => {
    [admin, artist, owner1, owner2] = await ethers.getSigners();

    const CosmoContract = await ethers.getContractFactory('CosmoContract')
    cosmoContract = await CosmoContract.deploy()
    await cosmoContract.deployed()

    const MarketPlaceContract = await ethers.getContractFactory('MarketPlaceContract')
    marketPlaceContract = await MarketPlaceContract.deploy(cosmoContract.address)
    await marketPlaceContract.deployed()

    await cosmoContract.authorizeOperator(marketPlaceContract.address)
    await cosmoContract.connect(owner1).buyTokens(3, {value: ethers.utils.parseUnits('3', 'ether')})
  })

  it("Should transfer Marketplace's NFT and pay royalties", async () => {
    let ownerNFT, offerdItem, balanceCustomer, balanceArtist;

    marketPlaceContract = marketPlaceContract.connect(admin)
    await marketPlaceContract.mint("UNO", artist.address, taxFee, cosmoContract.address)

    ownerNFT = await marketPlaceContract.ownerOf(0)
    expect(ownerNFT).to.equal(admin.address);

    await marketPlaceContract.approve(marketPlaceContract.address, 0)
    await marketPlaceContract.sellItem(marketPlaceContract.address, 0, ethers.utils.parseUnits('1', 'ether'))
    offerdItem = await marketPlaceContract.items(1)
    expect(offerdItem[5]).to.equal(artist.address)

    await marketPlaceContract.addContractToken(cosmoContract.address)

    await cosmoContract.approve(marketPlaceContract.address, offerdItem[6]);

    marketPlaceContract = marketPlaceContract.connect(owner1)
    await marketPlaceContract.buyItem(cosmoContract.address, 1, {value: ethers.utils.parseUnits('1', 'ether')})

    ownerNFT = await marketPlaceContract.ownerOf(0)
    expect(ownerNFT).to.equal(owner1.address);

    await marketPlaceContract.connect(owner1).transferFrom(owner1.address, owner2.address, 0);
    
    ownerNFT = await marketPlaceContract.ownerOf(0)
    expect(ownerNFT).to.equal(owner2.address);
    
    balanceCustomer = await cosmoContract.balanceOf(owner1.address);
    console.log(balanceCustomer)
    balanceArtist = await cosmoContract.balanceOf(artist.address);
    console.log(balanceArtist)
    // expect(balanceSender.toString()).to.equal(ethers.utils.parseUnits('3', 'ether'));
    // expect(balanceArtist.toString()).to.equal(ethers.utils.parseUnits('0.001', 'ether'));

  })
})

describe.skip('RoyaltiesContract testing', async () =>  {
  let artist, owner1, owner2;
  const taxFeeAmount = ethers.utils.parseUnits('0.001', 'ether');
  let cosmoContract, royalitiesContract;

  beforeEach(async() => {
    [artist, owner1, owner2] = await ethers.getSigners();

    const CosmoContract = await ethers.getContractFactory('CosmoContract')
    cosmoContract = await CosmoContract.deploy()
    await cosmoContract.deployed()

    const RoyalitiesContract = await ethers.getContractFactory('RoyaltiesContract')
    royalitiesContract = await RoyalitiesContract.deploy(artist.address, cosmoContract.address, ethers.utils.parseUnits('0.001', 'ether'))
    await royalitiesContract.deployed()

    await cosmoContract.connect(artist).authorizeOperator(royalitiesContract.address)
  })

  it('Should transfer NFT and pay royalties', async () => {
    let ownerNFT, balanceSender, balanceArtist;

    royalitiesContract = royalitiesContract.connect(artist)
    await royalitiesContract.transferFrom(artist.address, owner1.address, 0)

    ownerNFT = await royalitiesContract.ownerOf(0)
    expect(ownerNFT).to.equal(owner1.address);

    await cosmoContract.connect(owner1).buyTokens(3, {value: ethers.utils.parseUnits('3', 'ether')})

    await cosmoContract.connect(owner1).approve(royalitiesContract.address, txFeeAmount);
    await royalitiesContract.connect(owner1).transferFrom(owner1.address, owner2.address, 0);

    ownerNFT = await royalitiesContract.ownerOf(0)
    // balanceSender = await cosmoContract.balanceOf(owner1.address);
    // console.log(balanceSender)
    // balanceArtist = await cosmoContract.balanceOf(artist.address);
    // console.log(balanceArtist)

    expect(ownerNFT).to.equal(owner2.address);
    // expect(balanceSender.toString()).to.equal(ethers.utils.parseUnits('3', 'ether'));
    // expect(balanceArtist.toString()).to.equal(ethers.utils.parseUnits('0.001', 'ether'));

  })
})