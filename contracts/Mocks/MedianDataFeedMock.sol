pragma solidity >=0.4.24;

import "../IDataFeed.sol";

/**
 * @title MedianDataFeedMock
 * @dev Simplified data feed medianizer. !!LOCAL DEV ONLY!!
 */
contract MedianDataFeedMock is IDataFeed {
  function setResult(DataFeedOracleBase[] memory _dataFeeds) public {

  }

  function addDataFeed(DataFeedOracleBase dataFeed) public {

  }

  function removeDataFeed(DataFeedOracleBase dataFeed) public {

  }
}
