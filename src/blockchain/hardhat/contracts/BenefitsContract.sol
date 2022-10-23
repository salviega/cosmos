// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "./BenefitContract.sol";

contract BenefitsContract {

    mapping(string => BenefitContract) private benefitContracts;

    function createBenefit(string memory _benefitId, uint _nftNumber, address _manager, string memory _uri, uint256 _price, address _erc777Address, string memory _name, string memory _symbol) public {
        BenefitContract benefitContract = new BenefitContract(_manager, _nftNumber, _uri, _price, _erc777Address, _name, _symbol);
        benefitContracts[_benefitId] = benefitContract;
    }

    function getBenefit(string memory _benefitId) public view returns(address){
        return address(benefitContracts[_benefitId]);
    }
} 
