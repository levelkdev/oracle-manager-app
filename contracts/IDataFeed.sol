pragma solidity >=0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";

interface IDataFeed {
  function logResult() public;
  function addDataFeed(DataFeedOracleBase dataFeed) public;
  function removeDataFeed(DataFeedOracleBase dataFeed) public;
}
