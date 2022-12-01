// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "./BenefitContract.sol";

contract BenefitsGaslessContract is ERC2771Context {
    mapping(string => address) public benefitContracts;

    constructor(MinimalForwarder forwarder)
        ERC2771Context(address(forwarder))
    {}

    function createBenefit(
        string memory _benefitId,
        address _addressBenefitContract
    ) public {
        benefitContracts[_benefitId] = _addressBenefitContract;
    }

    function getBenefit(string memory _benefitId)
        public
        view
        returns (address)
    {
        return benefitContracts[_benefitId];
    }
}
