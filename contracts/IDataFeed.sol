pragma solidity >=0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";

interface IDataFeed {
  function setResult(DataFeedOracleBase[] memory _dataFeeds) public;
  function logResult() public;
  function addDataFeed(DataFeedOracleBase dataFeed) public;
  function removeDataFeed(DataFeedOracleBase dataFeed) public;
}
