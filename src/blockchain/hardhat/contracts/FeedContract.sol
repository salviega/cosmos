// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FeedContract {

    /**
     * Network: Fuji
     * Aggregator: AVAX/USD
     * Address: 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
     */
    AggregatorV3Interface internal priceFeed;
    
    constructor() {
        priceFeed = AggregatorV3Interface(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price/1e8;
    }
}