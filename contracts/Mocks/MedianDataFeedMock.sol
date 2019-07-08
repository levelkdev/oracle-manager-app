pragma solidity >=0.4.24;

import "../ITidbitDataFeedOracle.sol";

/**
 * @title MedianDataFeedMock
 * @dev Simplified data feed medianizer. !!LOCAL DEV ONLY!!
 */
contract MedianDataFeedMock is ITidbitDataFeedOracle {
  function setResult(DataFeedOracleBase[] memory _dataFeeds) public {

  }

  function addDataFeed(DataFeedOracleBase dataFeed) public {

  }

  function removeDataFeed(DataFeedOracleBase dataFeed) public {
    
  }
}
