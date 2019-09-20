pragma solidity >=0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';
import 'tidbit/contracts/DataFeedOracles/MedianDataFeedOracle.sol';
import 'token-price-oracles/contracts/DataFeeds/TimeMedianDataFeed.sol';
import "./IDataFeed.sol";

contract OracleManager is AragonApp, MedianDataFeedOracle, TimeMedianDataFeed {

  event DataFeedAdded(address dataFeedAddress);
  event DataFeedRemoved(address dataFeedAddress);

  modifier onlyDataSource() {
    // overwrite and remove this permission functionality so that
    // anyone can setResult()
    // all other permissions are handled by Aragon's ACL
    _;
  }

  bytes32 public constant MANAGE_DATA_FEEDS = keccak256("MANAGE_DATA_FEEDS");

  /**
  * @dev Initializes OracleManager
  */
  function initialize(address[] _dataFeedSources, address _dataSource)
    public
  {
    initialized();
    // require _dataSource is 0 address since parameter functionality is overridden
    require(_dataSource == address(0));
    // dataSource initialized with an arbitrary address, address(1), and will be unused in this implementation
    super.initialize(_dataFeedSources, address(1));
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

  /**
  * @dev sets result for median data feed. Needed because aragon apps do not
  *      recognize functions from extended contracts
  * @param _dataFeeds The dataFeeds to be updated
  */
  function setResult(DataFeedOracleBase[] _dataFeeds) public {
    MedianDataFeedOracle.setResult(_dataFeeds);
  }

  /**
  * @dev logs results for given data feed. Needed because aragon apps cannot
  *      perform transactions on external contracts
  * @param dataFeed The dataFeed to be updated
  */
  function updateDataFeedResult(address dataFeed)
    public
  {
    IDataFeed(dataFeed).logResult();
  }

  function viewCurrentResult(address dataFeed)
    public
    view
    returns (bytes32)
  {
    return IDataFeed(dataFeed).viewCurrentResult();
  }

  /**
  * @dev updates all approved data feeds and median data feed in one transaction.
  * @param _dataFeeds The dataFeeds to be updated
  */
  function updateAll(DataFeedOracleBase[] _dataFeeds) public {
    for (uint i=0; i < _dataFeeds.length; i++) {
      updateDataFeedResult(_dataFeeds[i]);
    }

    setResult(_dataFeeds);
  }

  // Workaround solution to get the contract address. Would be better to get from
  // Aragon client
  function contractAddress() public view returns (address) {
    return this;
  }

}
