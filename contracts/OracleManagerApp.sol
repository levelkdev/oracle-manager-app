pragma solidity >=0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import 'tidbit/contracts/DataFeedOracles/MedianDataFeedOracle.sol';
import "./ITidbitDataFeedOracle.sol";

contract OracleManagerApp is AragonApp, MedianDataFeedOracle {

  event DataFeedAdded(address dataFeedAddress);
  event DataFeedRemoved(address dataFeedAddress);

  bytes32 public constant MANAGE_DATA_FEEDS = keccak256("MANAGE_DATA_FEEDS");

  /**
  * @dev Initializes OracleManagerApp
  */
  function initialize(address[] _dataFeedSources, address  _dataSource)
    public
  {
    initialized();
    MedianDataFeedOracle.initialize(_dataFeedSources, _dataSource);
  }

  /**
  * @dev Auth protected function to add a dataFeed
  * @param dataFeed The dataFeed to be added
  */
  function addDataFeed(address dataFeed)
    public
    auth(MANAGE_DATA_FEEDS)
  {
    _addDataFeed(dataFeed);
  }

  /**
  * @dev Auth protected function to remove a dataFeed
  * @param dataFeed The dataFeed to be removed
  */
  function removeDataFeed(address dataFeed)
    public
    auth(MANAGE_DATA_FEEDS)
  {
    _removeDataFeed(dataFeed);
  }
}
