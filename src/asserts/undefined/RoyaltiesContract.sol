// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "hardhat/console.sol";

interface ICosmosContract {
    function substractCosmo(address _address, uint256 _amount) external returns (bool);
    function getSupplyBalance(address _address) external view returns (uint256);
}

contract RoyaltiesContract is ERC721, IERC777Recipient{
    
    ERC777 public immutable erc777;
    address public immutable txFeeToken;
    address public immutable artist;
    uint256 public txFeeAmount;
    mapping(address => bool) public excludedList;

    constructor(address _artist, address _erc777Address, uint256 _txFeeAmount) ERC721("Royalties", "RYTS") {
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
            .setInterfaceImplementer(
                address(this), 
                keccak256("ERC777TokensRecipient"), 
                address(this)
            ); 

        erc777 = ERC777(_erc777Address);
        txFeeToken = _erc777Address;
        artist = _artist;
        txFeeAmount = _txFeeAmount;
        excludedList[_artist] = true;
        _mint(artist, 0);
    }

    function tokensReceived (address _operator, address _from, address _to, uint256 _amount, bytes calldata _userData, bytes calldata _operatorData) override external {
        // revert();
    }

    function setExcluded(address excluded, bool status) external {
        require(msg.sender == artist, "artist only");
        excludedList[excluded] = status;
    }

    function transferFrom(address from, address to, uint256 tokenId ) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from,address to,uint256 tokenId) public override {
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from,address to,uint256 tokenId,bytes memory _data) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        _safeTransfer(from, to, tokenId, _data);
    }

    function _payTxFee(address from) internal {
        require(ICosmosContract(txFeeToken).getSupplyBalance(from) > txFeeAmount, "Insufficient tokens");
        if (!ICosmosContract(txFeeToken).substractCosmo(from, txFeeAmount)) {
            revert("Your funds are insufficients");
        }
        console.log("from: ", from);
        console.log("msg: ", msg.sender);
        erc777.operatorSend(from, artist, txFeeAmount, "", "");
    }
}
