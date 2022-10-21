  // SPDX-License-Identifier: GPL-3.0
  pragma solidity >=0.7.0 <=0.8.15;
    
    import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
    import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";
    import "./RecipientContract.sol";
    
    /**
    *  @title MarketPlaceContract
    *  
    *  NOTE: 
    *  
    */

    interface ICosmosContract {
      function substractCosmo(address _address, uint256 _amount) external returns(bool);
      function getSupplyBalance(address _address) external view returns(uint256);
    }

    contract MarketPlaceContract is ERC721URIStorage, ReentrancyGuard, RecipientContract {
      using Counters for Counters.Counter;

      Counters.Counter public ItemCounter;
      Counters.Counter public tokenIdCounter;
      
      /* Storege */
      struct Token {
        uint id;
        string URI;
        address artist;
        uint256 taxFee;
        address addressTaxFeeToken;
      }

      struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        string tokenURI;
        uint price;
        address tokenArtist;
        uint256 tokenTaxFee;
        address addressTaxFeeToken;
        bool sold;
        address payable seller;
      }

      mapping(uint => Item) public items;
      mapping(uint => Token) public tokens; 
      mapping(address => bool) public tokenApproved;
      mapping(address => address) artistList;
      mapping(address => mapping(address => bool)) excludedListByArtist;

      /* Events */

      /** @dev Offerd Emit when an NFT is for sale.
      * @param _itemId Item ID.
      * @param _nft NFT address.
      * @param _tokenId NFT ID.  
      * @param _tokenURI NFT metadata.
      * @param _price NFT price.
      * @param _artist Artist of the NFT.
      * @param _taxFee Tax for transfer NFT.
      * @param _addressTaxFeeToken address of the token.
      * @param _seller Seller address.
      */
      event Offerd(uint _itemId, address indexed _nft,  uint _tokenId, string _tokenURI, uint _price, address _artist, uint256 _taxFee, address _addressTaxFeeToken, address indexed _seller);

      /** @dev Bought Emit when an NFT was purchased.
      * @param _itemId Item ID.
      * @param _nft NFT address.
      * @param _tokenId NFT ID.  
      * @param _tokenURI NFT metadata.
      * @param _price NFT price.
      * @param _artist Artist of the NFT.
      * @param _taxFee Tax for transfer NFT.
      * @param _addressTaxFeeToken address of the token.
      * @param _buyer Buyer address.
      */
      event Bought(uint _itemId, address indexed _nft,  uint _tokenId, string _tokenURI, uint _price, address _artist, uint256 _taxFee, address _addressTaxFeeToken, address indexed _buyer);
      
      /** @dev Constructor
      * @param _erc777Address cosmo address (ERC777).
      */
      constructor(address _erc777Address) ERC721("Cosmos", "CSMS") RecipientContract(_erc777Address) {
        
      }

      // ************************ //
      // *      Functions       * //
      // ************************ //
        
      /** @dev Put an NFT for sale.
      * @param _nft NFT address.
      * @param _tokenId NFT ID.
      * @param _price NFT price.
      */
      function sellItem(IERC721 _nft, uint _tokenId, uint _price) external onlyOwner nonReentrant {
        require(_price > 0, "Price must be greater that 0");

        ItemCounter.increment();
        uint256 itemId = ItemCounter.current();

        _nft.transferFrom(msg.sender, address(this), _tokenId);
        
        Token memory token = tokens[_tokenId]; 
        Item memory newItem = Item(itemId, _nft, _tokenId, token.URI, _price, token.artist, token.taxFee, token.addressTaxFeeToken, false, payable(msg.sender));
        items[itemId] = newItem; 
        
        emit Offerd(itemId, address(_nft), _tokenId, token.URI, _price, token.artist, token.taxFee, token.addressTaxFeeToken, payable(msg.sender));
      }

      /** @dev Generate NFT purchase.
      * @param _itemId Item ID.
      */
      function buyItem(address _cosmoAddress, uint _itemId) payable external nonReentrant {
        uint price = items[_itemId].price;
        Item storage item = items[_itemId];

        require(tokenApproved[_cosmoAddress] == true, "We don't accept this token");
        require(ICosmosContract(_cosmoAddress).getSupplyBalance(msg.sender) > price, "Insufficient tokens");
        require(_itemId > 0 && _itemId <= ItemCounter.current(), "Item don't exist");
        require(!item.sold, "Item already sold");
        
        if(!ICosmosContract(_cosmoAddress).substractCosmo(msg.sender, price)) {
          revert("Your funds are insufficient");
        }

        deposit(price);
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        
        Item storage purchasedItem = items[_itemId];
        purchasedItem.sold = true;
        Token memory purchasedToken = tokens[purchasedItem.tokenId];
        
        emit Bought(item.itemId, address(item.nft), item.tokenId, purchasedToken.URI, item.price, item.tokenArtist, item.tokenTaxFee, item.addressTaxFeeToken, payable(msg.sender));
      }

      /** @dev Generate NFT mint.
      * @param _tokenURI NFT metadata.
      */
      
      function mint(string memory _tokenURI, address _artist, uint256 _taxFee, address _addressTaxFeeToken) public onlyOwner returns (uint) {
        artistList[_artist] = _artist;

        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokens[tokenId] = Token(tokenId, _tokenURI, _artist, _taxFee, _addressTaxFeeToken);
        
        return tokenId;
      }

      /** @dev Add token's cotracts.
      * @param _addressToken address tokens.
      */
      function addContractToken(address _addressToken) external onlyOwner {
        require(tokenApproved[_addressToken] == false, "This token is already approved");
        tokenApproved[_addressToken] = true;
      }

      /** @dev Select address that don't pay tax fee.
      * @param _excluded address that don't pay tax fee.
      * @param _status if the address is or not exclusive.
      */
      function setExcluded(address _excluded, bool _status) external {
        require(artistList[msg.sender] == msg.sender, "doesn't has NFTs in the marketplace");
        excludedListByArtist[msg.sender][_excluded] = _status;
      }

      function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721: transfer caller is not owner nor approved");
        address artist = tokens[_tokenId].artist;
        if (excludedListByArtist[artist][_from] == false) {
            uint256 taxFee = tokens[_tokenId].taxFee;
            address addressTaxFeeToken = tokens[_tokenId].addressTaxFeeToken;
            _payTxFee(_from, artist, taxFee, addressTaxFeeToken);
        }
        _transfer(_from, _to, _tokenId);
      } 

      function safeTransferFrom(address _from, address _to, uint256 _tokenId) public override {
        address artist = tokens[_tokenId].artist;
        if (excludedListByArtist[artist][_from] == false) {
          uint256 taxFee = tokens[_tokenId].taxFee;
          address addressTaxFeeToken = tokens[_tokenId].addressTaxFeeToken;
          _payTxFee(_from, artist, taxFee, addressTaxFeeToken);
        }
        safeTransferFrom(_from, _to, _tokenId, "");
      }

      function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) public override {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721: transfer caller is not owner nor approved");
        
        address artist = tokens[_tokenId].artist;
        if (excludedListByArtist[artist][_from] == false) {
          uint256 taxFee = tokens[_tokenId].taxFee;
          address addressTaxFeeToken = tokens[_tokenId].addressTaxFeeToken;
          _payTxFee(_from, artist, taxFee, addressTaxFeeToken);
        }
        _safeTransfer(_from, _to, _tokenId, _data);
      }

      function _payTxFee(address _from, address _artist, uint256 _taxFee, address _addressTaxFeeToken) internal {
        require(ICosmosContract(_addressTaxFeeToken).getSupplyBalance(_from) > _taxFee, "Insufficient tokens");
        if (!ICosmosContract(_addressTaxFeeToken).substractCosmo(_from, _taxFee)) {
            revert("Your funds are insufficients");
        }
        transferTaxFee(_from, _artist, _taxFee);
      }
}