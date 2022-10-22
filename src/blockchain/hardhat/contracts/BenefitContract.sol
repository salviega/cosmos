// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RecipientContract.sol";

interface ICosmosContract {
    function substractCosmo(address _address, uint256 _amount) external returns(bool);
    function getSupplyBalance(address _address) external view returns(uint256);
}

contract BenefitContract is ERC721URIStorage, RecipientContract {
    using Roles for Roles.Role;

    Roles.Role private ADMIN;
    Roles.Role private MANAGER;
    using Counters for Counters.Counter;

    Counters.Counter public ItemCounter;
    Counters.Counter public tokenIdCounter;

    struct Token {
      uint id;
      string URI;
    }

    struct Item {
      IERC721 nft;
      uint itemId;
      uint tokenId;
      string tokenURI;
      uint price;
      bool sold;
      bool checkIn;
      bool redeem;
      address payable seller;
    }

    mapping(uint => Item) public items;
    mapping(uint => Token) public tokens; 
    mapping(address => bool) public tokenApproved;

    uint256 price;
    uint maxMint;
    string uri;

    constructor(address _manager, uint _maxMint, string memory _uri, uint256 _price, address _erc777Address, string memory _name, string memory _symbol) ERC721(_name, _symbol) RecipientContract(_erc777Address) {
        ADMIN.add(msg.sender);
        MANAGER.add(_manager);
        uri = _uri;
        price = _price;
        maxMint = _maxMint;
    }

    function safeMint() public returns(uint) {
        require(ADMIN.has(msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
        uint tokenId = tokenIdCounter.current();
        require(tokenId > maxMint, "Mint limit completed");
        tokenIdCounter.increment();
        tokens[tokenId] = Token(tokenId, uri);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    function sellItem(IERC721 _nft, uint _tokenId, uint _price) public {
      require(ADMIN.has(msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
      require(_price > 0, "Price must be greater that 0");

      ItemCounter.increment();
      uint256 itemId = ItemCounter.current();

      Token memory token = tokens[_tokenId]; 
      Item memory newItem = Item(_nft, itemId, _tokenId, token.URI, _price, false, false, false, payable(msg.sender));
      items[itemId] = newItem; 
      _nft.transferFrom(msg.sender, address(this), _tokenId);
      
    }

    function buyItem(address _tokenAddress, uint _itemId) payable external {
      Item storage item = items[_itemId];

      require(tokenApproved[_tokenAddress] == true, "We don't accept this token");
      require(ICosmosContract(_tokenAddress).getSupplyBalance(msg.sender) > price, "Insufficient tokens");
      require(_itemId > 0 && _itemId <= ItemCounter.current(), "Item don't exist");
      require(!item.sold, "Item already sold");
      
      if(!ICosmosContract(_tokenAddress).substractCosmo(msg.sender, price)) {
        revert();
      }

      deposit(price);
      item.nft.transferFrom(address(this), msg.sender, item.tokenId);
      
      Item storage purchasedItem = items[_itemId];
      purchasedItem.sold = true;
      
    }

    function checkIn(uint _tokenId) external returns(bool) {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of the NFT");
        Item storage item = items[_tokenId];
        item.checkIn = true;
        return item.checkIn;
    }

    function redeemBenefit(address _customer, uint _tokenId) public returns(bool){
        require(MANAGER.has(msg.sender) || ADMIN.has(msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
        require(balanceOf(_customer) == _tokenId, "This token doesn't your");
        require(items[_tokenId].checkIn, "You need to do check-in");
        Item storage benefit = items[_tokenId];
        benefit.redeem = true;
        return benefit.redeem;
    }

    function addContractToken(address _address) external {
      require(ADMIN.has(msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
      require(tokenApproved[_address] == false, "This token is already approved");
      tokenApproved[_address] = true;
    }       
}

library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}


