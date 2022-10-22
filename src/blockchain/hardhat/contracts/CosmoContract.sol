// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CosmoContract is ERC777, Ownable {

  uint256 public AVAXtotal = 0;
  mapping(address => address) public ownerBalances;
  mapping(address => uint256) public supplyCosmoBalances;
 
  constructor() ERC777("Cosmo", "CSM", new address[](0)) {

  }

  function safeMint(address _contract, uint256 _supply) public onlyOwner {
    _mint(_contract, _supply, "", "");
    ownerBalances[_contract] = _contract;
    supplyCosmoBalances[_contract] += _supply;
  }

  function substractCosmo(address _address, uint256 _amount) external returns(bool) {
    require(ownerBalances[_address] == _address, "You are not the owner");
    supplyCosmoBalances[_address] -= _amount;
    return true;
  }

  function buyTokens(uint256 _value) payable public {
    require(msg.value == _value, "Insuffcient funds");
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

  function getSupplyBalance(address _address) external view returns(uint256) {
    return supplyCosmoBalances[_address];
  }
}