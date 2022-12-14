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
      bool checkIn;
      bool redeem;
      address buyer;
    }

    mapping(uint => Token) public tokens; 
    mapping(address => uint[]) public benefitsIdByCustomer;

    string public uri;
    uint public maxMint;
    uint256 public price;

    constructor(address _manager, uint _maxMint, string memory _uri, uint256 _price, address _erc777Address, string memory _name, string memory _symbol) ERC721(_name, _symbol) RecipientContract(_erc777Address) {
        ADMIN.add(msg.sender);
        MANAGER.add(_manager);
        uri = _uri;
        price = _price;
        maxMint = _maxMint;
    }

    function safeMint(address _tokenAddress) public returns(uint) {
      require(tokenIdCounter.current() < maxMint, "Mint limit completed");
      require(ICosmosContract(_tokenAddress).getSupplyBalance(msg.sender) > price, "Insufficient tokens");
      
      if(!ICosmosContract(_tokenAddress).substractCosmo(msg.sender, price)) {
        revert();
      }

      uint tokenId = tokenIdCounter.current();
      tokenIdCounter.increment();
      Token memory token = Token(tokenId, uri, false, false, msg.sender);
      tokens[tokenId] = token;
      benefitsIdByCustomer[msg.sender].push(tokenId);

      deposit(price);
      _safeMint(msg.sender, tokenId);
      _setTokenURI(tokenId, uri);

      return tokenId;
    }

    function checkIn(uint _tokenId) external returns(bool) {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of the NFT");
        Token storage token = tokens[_tokenId];
        token.checkIn = true;
        return token.checkIn;
    }

    function redeemBenefit(address _customer, uint _tokenId) public returns(bool){
        require(MANAGER.has(msg.sender) || ADMIN.has(msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
        require(ownerOf(_tokenId) == _customer, "This token doesn't your");
        require(tokens[_tokenId].checkIn, "You need to do check-in");
        Token storage token = tokens[_tokenId];
        token.redeem = true;
        return token.redeem;
    }   

    function getBenefitsIdsByCustomer(address _owner) view public returns(uint[] memory) {
        return benefitsIdByCustomer[_owner];
    }

    function isManagerOrAdmin() view public returns(bool) {
        if(MANAGER.has(msg.sender)) {
            return true;
        }
        if(ADMIN.has(msg.sender)) {
            return true;
        }
        return false;
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


