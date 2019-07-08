pragma solidity >=0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";

interface ITidbitDataFeedOracle {
  function setResult(DataFeedOracleBase[] memory _dataFeeds) public;
  function addDataFeed(DataFeedOracleBase dataFeed) public;
  function removeDataFeed(DataFeedOracleBase dataFeed) public;
}
