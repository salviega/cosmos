// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract RecipientContract is IERC777Recipient {

    ERC777 public immutable erc777;
    address public immutable account;

    modifier onlyOwner() {
        require(msg.sender == account, "MarketPlaceContract: caller is not the owner");
        _;
    }

    constructor (address _erc777Address)
    {
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
            .setInterfaceImplementer(
                address(this), 
                keccak256("ERC777TokensRecipient"), 
                address(this)
            );
        erc777 = ERC777(_erc777Address);
        account = msg.sender;
    }

    function tokensReceived (address _operator, address _from, address _to, uint256 _amount, bytes calldata _userData, bytes calldata _operatorData) override external {
        // revert();
    }

    function deposit(uint amount) internal {
        erc777.operatorSend(address(msg.sender), address(this), amount, "", "");
    }

    function withdrawTokens() external onlyOwner {
        require(address(this).balance > 0, "There don't tokens");
        erc777.operatorSend(address(this), address(msg.sender), address(this).balance, "", "");
    }
  
    function totalAsserts() view external returns(uint256) {
        return address(this).balance;
    }
}
