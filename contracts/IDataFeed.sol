pragma solidity >=0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";

interface IDataFeed {
  function viewCurrentResult() public view returns (bytes32);
  function latestResult() public view returns (bytes32);
  function latestResultDate() public view returns (uint256);
  function logResult() public;
  function addDataFeed(DataFeedOracleBase dataFeed) public;
  function removeDataFeed(DataFeedOracleBase dataFeed) public;
}
