// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

interface ICosmosContract {
    function substractAsserts(address _address, uint256 _amount)
        external
        returns (bool);

    function getSupplyBalance(address _address) external view returns (uint256);
}

contract NFT is ERC721 {
    address public artist;
    address public txFeeToken;
    uint256 public txFeeAmount;
    mapping(address => bool) public excludedList;

    constructor(
        address _artist,
        address _txFeeToken,
        uint256 _txFeeAmount
    ) ERC721("My NFT", "ABC") {
        artist = _artist;
        txFeeToken = _txFeeToken;
        txFeeAmount = _txFeeAmount * 1e18;
        excludedList[_artist] = true;
        _mint(artist, 0);
    }

    function setExcluded(address excluded, bool status) external {
        require(msg.sender == artist, "artist only");
        excludedList[excluded] = status;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        if (excludedList[from] == false) {
            _payTxFee(from);
        }
        _safeTransfer(from, to, tokenId, _data);
    }

    function _payTxFee(address from) internal {
        IERC777 cosmo = IERC777(txFeeToken);
        require(
            ICosmosContract(txFeeToken).getSupplyBalance(from) > txFeeAmount,
            "Insufficient tokens"
        );

        if (
            !ICosmosContract(txFeeToken).substractAsserts(
                msg.sender,
                txFeeAmount
            )
        ) {
            revert();
        }
        cosmo.operatorSend(from, artist, txFeeAmount, "", "");
    }
}
