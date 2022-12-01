// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract CosmoGaslessContract is ERC2771Context, ERC777, Ownable {
    uint256 public AVAXtotal = 0;
    mapping(address => address) public ownerBalances;
    mapping(address => uint256) public supplyCosmoBalances;

    constructor(MinimalForwarder forwarder)
        ERC2771Context(address(forwarder))
        ERC777("Cosmo", "CSM", new address[](0))
    {}

    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }

    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address sender)
    {
        sender = ERC2771Context._msgSender();
    }

    function safeMint(address _contract, uint256 _supply) public {
        ownerBalances[_contract] = _contract;
        supplyCosmoBalances[_contract] += _supply;
        _mint(_contract, _supply, "", "");
    }

    function substractCosmo(address _address, uint256 _amount)
        external
        returns (bool)
    {
        require(ownerBalances[_address] == _address, "You are not the owner");
        supplyCosmoBalances[_address] -= _amount;
        return true;
    }

    function buyTokens(uint256 _value) public payable {
        require(msg.value >= _value, "Insuffcient funds");
        ownerBalances[msg.sender] = msg.sender;
        supplyCosmoBalances[msg.sender] += _value;
        _mint(msg.sender, _value, "", "");
        AVAXtotal += _value;
    }

    function withdrawAVAX() external onlyOwner {
        require(AVAXtotal > 0, "Don't have funds");
        payable(owner()).transfer(AVAXtotal);
        AVAXtotal = 0;
    }

    function getSupplyBalance(address _address)
        external
        view
        returns (uint256)
    {
        return supplyCosmoBalances[_address];
    }
}
