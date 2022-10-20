// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CosmoContract is ERC777, Ownable {

  mapping(address => address) public ownerBalances;
  mapping(address => uint256) public supplyBalances;

  constructor() ERC777("Cosmo", "CSM", new address[](0)) {
  
  }

  function safeMint(address _contract, uint256 _supply) public onlyOwner {
    _mint(_contract, _supply * 1e18, "", "");
    ownerBalances[_contract] = _contract;
    supplyBalances[_contract] += _supply * 1e18;
  }

  function substractAsserts(address _address, uint256 _amount) external returns(bool) {
    require(ownerBalances[_address] == _address, "You are not the owner");
    supplyBalances[_address] -= _amount;
    return true;
  }

  function getSupplyBalance(address _address) external view returns(uint256) {
    return supplyBalances[_address];
  }
}